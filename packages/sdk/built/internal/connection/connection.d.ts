/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import { Guid } from '../..';
import { ExponentialMovingAverage, Message, NetworkStatsReport, QueuedPromise, TrackingClock } from '../../internal';
/**
 * @hidden
 * Class for tracking connection quality.
 */
export declare class ConnectionQuality {
    private _latencyMs;
    private _trackingClock;
    /**
     * Calculates a moving average of latency on the connection.
     */
    get latencyMs(): ExponentialMovingAverage;
    /**
     * If this is a client, tracks last known "server time" and can estimate current server time.
     * For a most accurate estimate, subtract the value of latency from the current server time.
     */
    get trackingClock(): TrackingClock;
}
/**
 * Interface for sending and receiving messages with a client.
 */
export interface Connection {
    readonly quality: ConnectionQuality;
    readonly promises: Map<Guid, QueuedPromise>;
    /** A snapshot of this connection's bandwidth usage */
    readonly statsReport: NetworkStatsReport;
    /**
     * Registers a handler for the 'send' or 'recv' events. Called when a new message is to be sent.
     */
    on(event: 'send' | 'recv', listener: (message: Message, serializedMessage?: Buffer) => void): void;
    /**
     * Registers a handler for the 'close' event. Called when the connection was closed.
     */
    on(event: 'close', listener: () => void): void;
    /**
     * Registers a handler for the 'error' event. Called when the connection experiences an error.
     */
    on(event: 'error', listener: (err: any) => void): void;
    /**
     * Unregisters the handler for these events.
     */
    off(event: 'send' | 'recv', listener: (message: Message, serializedMessage?: Buffer) => void): void;
    off(event: 'close', listener: () => void): void;
    off(event: 'error', listener: (err: any) => void): void;
    /**
     * Close the connection.
     */
    close(): void;
    /**
     * Sends a message.
     */
    send(message: Message, serializedMessage?: Buffer): void;
    /**
     * Receives a message.
     */
    recv(message: Message, serializedMessage?: Buffer): void;
}
//# sourceMappingURL=connection.d.ts.map