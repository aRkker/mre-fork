"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebHost = void 0;
const Restify = __importStar(require("restify"));
const restify_errors_1 = require("restify-errors");
const etag_1 = __importDefault(require("etag"));
const jsonschema_1 = require("jsonschema");
const manifestSchema_json_1 = __importDefault(require("./manifestSchema.json"));
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("util");
const readFile = util_1.promisify(fs_1.readFile);
const __1 = require("..");
/**
 * Sets up an HTTP server, and generates an MRE context for your app to use.
 */
class WebHost {
    constructor(options = {}) {
        this.manifest = null;
        this.bufferMap = {};
        this.checkStaticBuffers = (req, res, next) => {
            const info = this.bufferMap[req.params.name];
            if (info) {
                res.setHeader('ETag', info.etag);
                next();
            }
            else {
                next(new restify_errors_1.NotFoundError(`No buffer registered under name ${req.params.name}`));
            }
        };
        this.serveStaticBuffers = (req, res, next) => {
            const info = this.bufferMap[req.params.name];
            if (info) {
                res.contentType = info.contentType;
                res.sendRaw(200, info.buffer);
                next();
            }
            else {
                next(new restify_errors_1.NotFoundError(`No buffer registered under name ${req.params.name}`));
            }
        };
        const pjson = require('../../package.json'); /* eslint-disable-line @typescript-eslint/no-var-requires */
        __1.log.info('app', `Node: ${process.version}`);
        __1.log.info('app', `${pjson.name}: v${pjson.version}`);
        this._baseDir = options.baseDir || process.env.BASE_DIR;
        // Resolve the port number. Heroku defines a PORT environment var (remapped from 80).
        const port = options.port || process.env.PORT || 3901;
        // Create a Multi-peer adapter
        this._adapter = new __1.MultipeerAdapter({ port });
        // Start listening for new app connections from a multi-peer client.
        const serverP = this.validateManifest().then(() => this._adapter.listen());
        this._ready = serverP.then();
        serverP.then(server => {
            __1.log.info('app', `${server.name} listening on ${JSON.stringify(server.address())}`);
            __1.log.info('app', `baseDir: ${this.baseDir}`);
            // check if a procedural manifest is needed, and serve if so
            this.serveManifestIfNeeded(server, options.permissions, options.optionalPermissions);
            // serve static buffers
            server.get(`/buffers/:name`, this.checkStaticBuffers, Restify.plugins.conditionalRequest(), this.serveStaticBuffers);
            // serve static files
            if (this.baseDir) {
                server.get('/*', Restify.plugins.serveStaticFiles(this._baseDir));
            }
        })
            .catch(reason => __1.log.error('app', `Failed to start HTTP server: ${reason}`));
    }
    get adapter() { return this._adapter; }
    get baseDir() { return this._baseDir; }
    /**
     * A promise that resolves when the HTTP server is listening.
     * Get the server reference from `webHost.adapter.server`.
     */
    get ready() { return this._ready; }
    async validateManifest() {
        const manifestPath = path_1.resolve(this.baseDir, './manifest.json');
        try {
            this.manifest = await readFile(manifestPath);
        }
        catch (_a) {
            return;
        }
        let manifestJson;
        try {
            manifestJson = JSON.parse(this.manifest.toString('utf8'));
        }
        catch (_b) {
            __1.log.error('app', `App manifest "${manifestPath}" is not JSON`);
            this.manifest = null;
            return;
        }
        const result = jsonschema_1.validate(manifestJson, manifestSchema_json_1.default);
        if (!result.valid) {
            __1.log.error('app', `App manifest "${manifestPath}" is not valid:\n${result.errors.join('\n')}`);
            this.manifest = null;
            return;
        }
    }
    serveManifestIfNeeded(server, permissions, optionalPermissions) {
        // print warning if no manifest supplied
        if (!this.manifest && !permissions && !optionalPermissions) {
            __1.log.warning('app', "No MRE manifest provided, and no permissions requested! For this MRE to use protected features, " +
                `provide an MRE manifest at "${path_1.resolve(this.baseDir, './manifest.json')}", or pass a permissions ` +
                "list into the WebHost constructor.");
        }
        server.get('/manifest.json', (_, res, next) => {
            if (this.manifest) {
                res.sendRaw(200, this.manifest, { "Content-Type": "application/json" });
            }
            else if (permissions || optionalPermissions) {
                res.json(200, { permissions, optionalPermissions });
            }
            else {
                res.send(404);
            }
            next();
        });
    }
    /**
     * Serve arbitrary binary blobs from a URL
     * @param filename A unique string ID for the blob
     * @param blob A binary blob
     * @param contentType The MIME type that identifies this blob
     * @returns The URL to fetch the provided blob
     */
    registerStaticBuffer(filename, blob, contentType = 'application/octet-stream') {
        this.bufferMap[filename] = {
            buffer: blob,
            etag: etag_1.default(blob),
            contentType
        };
        return `buffers/${filename}`;
    }
}
exports.WebHost = WebHost;
//# sourceMappingURL=webHost.js.map