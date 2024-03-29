"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyClient = void 0;
const semver_1 = __importDefault(require("semver"));
const internal_1 = require("../../internal");
const __1 = require("../..");
/*
 * Current SDK Version - Read from package.json.
 */
const CurrentSDKVersion = semver_1.default.coerce(require('../../../package.json').version);
/*
 * Minimum Supported Client Library version
 * As part of the manual SDK release procedures, this is reset to match CurrentSDKVersion Major.Minor if new functions
 * have been added that don't work on older clients (i.e. pretty much every release). Since host apps are required to
 * update client libraries regularly, this one is not a big deal to update.
 */
const MinimumSupportedClientVersion = semver_1.default.coerce('0.20');
/**
 * @hidden
 * 'ws' middleware to validate the client protocol version when processing a connection upgrade request.
 * @param info 'ws' request information
 * @param cb 'ws' verification callback
 */
function verifyClient(info, cb) {
    // Look for the upgrade request.
    const req = info.req || {};
    // Look for the request headers.
    const headers = req.headers || [];
    // Verify minimum supported versions are met (client and SDK).
    /*
     * Due to a shortcoming in C# ClientWebSocket, we have no way to convey any error details in the HTTP response,
     * including error code.
     *    See: "ClientWebSocket does not provide upgrade request error details"
     *    https://github.com/dotnet/corefx/issues/29163
     */
    const CurrentClientVersion = semver_1.default.coerce(decodeURIComponent(headers[internal_1.Constants.HTTPHeaders.CurrentClientVersion]));
    const MinimumSupportedSDKVersion = semver_1.default.coerce(decodeURIComponent(headers[internal_1.Constants.HTTPHeaders.MinimumSupportedSDKVersion]));
    if (CurrentClientVersion && MinimumSupportedSDKVersion) {
        // Test the current client version. Is it greater than or equal to the minimum client version?
        const clientPass = semver_1.default.gte(CurrentClientVersion, MinimumSupportedClientVersion);
        // Test the current SDK version. Is it greater than or equal to the minimum SDK version?
        const sdkPass = semver_1.default.gte(CurrentSDKVersion, MinimumSupportedSDKVersion);
        if (!clientPass) {
            const message = `Connection rejected due to out of date client. ` +
                `Client version: ${CurrentClientVersion.toString()}. ` +
                `Min supported version by SDK: ${MinimumSupportedClientVersion.toString()}`;
            __1.log.info('app', message);
            return cb(false, 403, message);
        }
        if (!sdkPass) {
            const message = `Connection rejected due to out of date SDK. ` +
                `Current SDK version: ${CurrentSDKVersion.toString()}. ` +
                `Min supported version by client: ${MinimumSupportedSDKVersion.toString()}`;
            __1.log.info('app', message);
            // Log this line to the console. The developer should know about this.
            // eslint-disable-next-line no-console
            console.info(message);
            return cb(false, 403, message);
        }
        // Client and SDK are compatible.
        return cb(true);
    }
    // Temporary: Support old clients reporting the legacy protocol version.
    // TODO: Remove this after a few releases.
    const legacyProtocolVersion = decodeURIComponent(headers[internal_1.Constants.HTTPHeaders.LegacyProtocolVersion]);
    if (legacyProtocolVersion === '1') {
        return cb(true);
    }
    return cb(false, 403, "Version headers missing.");
}
exports.verifyClient = verifyClient;
//# sourceMappingURL=verifyClient.js.map