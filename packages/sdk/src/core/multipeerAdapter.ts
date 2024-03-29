/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as http from 'http';
import QueryString from 'query-string';
import * as Restify from 'restify';
import semver from 'semver';
import UUID from 'uuid/v4';
import * as WS from 'ws';

import {
	Context,
	log,
	ParameterSet
} from '..';
import {
	Adapter,
	AdapterOptions,
	Client,
	ClientHandshake,
	ClientStartup,
	Constants,
	Pipe,
	Session,
	verifyClient,
	WebSocket
} from '../internal';

const forwarded: (res: http.IncomingMessage, headers: http.IncomingHttpHeaders) => { ip: string; port: number }
	= require('forwarded-for'); /* eslint-disable-line @typescript-eslint/no-var-requires */

/**
 * Multi-peer adapter options
 */
export type MultipeerAdapterOptions = AdapterOptions & {
	/**
	 * @member peerAuthoritative (Optional. Default: true) Whether or not to run in the `peer-authoritative`
	 * operating model. When true, one peer is picked to synchonize actor changes, animation states, etc.
	 * When false, no state is synchronized between peers.
	 */
	peerAuthoritative?: boolean;
};

/**
 * The `MultipeerAdapter` is appropriate to use when the host environment has no authoritative
 * server simulation, where each client owns some part of the simulation, and a connection from each client to the Mixed
 * Reality Extension (MRE) app is necessary. The MultipeerAdapter serves as an aggregation point for these client
 * connections. This adapter is responsible for app state synchronization to new clients, and for managing distributed
 * state ownership (i.e., which client is authoritative over what parts of the simulated state).
 *
 * Example hosts:
 *  - AltspaceVR
 *  - Peer-to-peer multiuser topologies
 */
export class MultipeerAdapter extends Adapter {

	// FUTURE: Make these child processes?
	public sessions: { [id: string]: Session } = {};

	/** @override */
	protected get options(): MultipeerAdapterOptions { return this._options; }

	/**
	 * Creates a new instance of the Multi-peer Adapter
	 */
	constructor(options?: MultipeerAdapterOptions) {
		super(options);
		this._options = { peerAuthoritative: true, ...this._options } as AdapterOptions;
	}

	/**
	 * Start the adapter listening for new incoming connections from engine clients
	 */
	public listen() {
		if (!this.server) {
			// If necessary, create a new web server
			return new Promise<Restify.Server>((resolve) => {
				const server = this.server = Restify.createServer({ name: "Multi-peer Adapter" });
				this.server.listen(this.port, () => {
					this.startListening();
					resolve(server);
				});
			});
		} else {
			// Already have a server, so just start listening
			this.startListening();
			return Promise.resolve(this.server);
		}
	}

	private async getOrCreateSession(sessionId: string, params: ParameterSet) {
		let session = this.sessions[sessionId];
		if (!session) {
			// Create an in-memory "connection" (If the app were running remotely, we would connect
			// to it via WebSocket here instead)
			const pipe = new Pipe();
			pipe.local.statsTracker.on('incoming', bytes => pipe.remote.statsTracker.recordIncoming(bytes));
			pipe.local.statsTracker.on('outgoing', bytes => pipe.remote.statsTracker.recordOutgoing(bytes));
			pipe.local.on('linkQuality', quality => pipe.remote.linkConnectionQuality(quality));

			// Create a new context for the connection, passing it the remote side of the pipe.
			const context = new Context({
				sessionId,
				connection: pipe.remote
			});
			// Start the context listening to network traffic.
			context.internal.startListening().catch(() => pipe.remote.close());
			// Instantiate a new session.
			session = this.sessions[sessionId] = new Session(
				pipe.local, sessionId, this.options.peerAuthoritative);
			// Handle session close.
			session.on('close', () => delete this.sessions[sessionId]);
			// Connect the session to the context.
			await session.connect(); // Allow exceptions to propagate.
			// Pass the new context to the app.
			this.emitter.emit('connection', context, params);
			// Start context's update loop.
			context.internal.start();
			// Subscribe for default authoritative simulation owner changes
			session.on('set-authoritative', context.internal.onSetAuthoritative);
		}
		return session;
	}

	private startListening() {
		// Create a server for upgrading HTTP connections to WebSockets
		const wss = new WS.Server({ server: this.server, verifyClient });

		// Handle WebSocket connection upgrades
		wss.on('connection', async (ws: WS, request: http.IncomingMessage) => {
			try {
				log.info('network', "New Multi-peer connection");

				// Read the sessionId header.
				let sessionId = request.headers[Constants.HTTPHeaders.SessionID] as string || UUID();
				sessionId = decodeURIComponent(sessionId);

				// Read the client's version number
				const version = semver.coerce(request.headers[Constants.HTTPHeaders.CurrentClientVersion] as string);

				// Parse URL parameters.
				const params = QueryString.parseUrl(request.url).query;

				// Get the client's IP address rather than the last proxy connecting to you.
				const address = forwarded(request, request.headers);

				// Create a WebSocket for this connection.
				const conn = new WebSocket(ws, address.ip);

				// Instantiate a client for this connection.
				const client = new Client(conn, version);

				// Join the client to the session.
				await this.joinClientToSession(client, sessionId, params);
			} catch (e) {
				log.error('network', e);
				ws.close();
			}
		});
	}

	// @ts-ignore
	private async joinClientToSession(client: Client, sessionId: string, params: QueryString.OutputParams) {
		try {
			// Handshake with the client.
			const handshake = new ClientHandshake(client, sessionId);
			await handshake.run();

			// Measure the connection quality and wait for sync-request message.
			const startup = new ClientStartup(client, handshake.syncRequest);
			await startup.run();

			// Get the session for the sessionId.
			const session = await this.getOrCreateSession(sessionId, params);

			// Join the client to the session.
			await session.join(client);
		} catch (e) {
			log.error('network', e);
			client.conn.close();
		}
	}
}
