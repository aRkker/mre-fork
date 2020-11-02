"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const path_1 = require("path");
const app_1 = require("./app");
// Read .env if file exists
dotenv_1.default.config();
process.on('uncaughtException', (err) => console.log('uncaughtException', err));
process.on('unhandledRejection', (reason) => console.log('unhandledRejection', reason));
// MRE.log.enable('network');
// MRE.log.enable('network-content');
// Start listening for connections, and serve static files
const server = new MRE.WebHost({
    // baseUrl: 'http://<ngrok-id>.ngrok.io',
    baseDir: path_1.resolve(__dirname, '../public')
});
// Handle new application sessions
server.adapter.onConnection((context, params) => new app_1.App(context, params, server.baseUrl));
exports.default = server;
//# sourceMappingURL=server.js.map