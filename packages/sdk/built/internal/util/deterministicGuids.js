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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeterministicGuids = void 0;
const crypto = __importStar(require("crypto"));
// Map for byte <-> hex string conversion
const byteToHex = [];
for (let i = 0; i < 256; i++) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
}
function uuidParse(buf) {
    let i = 0;
    const bth = byteToHex;
    return (bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]]);
}
/**
 * @hidden
 * Class for generating a sequence of deterministic GUID values.
 * NOTE: This is a quick hack, and does not generate valid UUIDs.
 * To generate a deterministic sequence of values that are also valid
 * UUIDs, we must employ the "Name-based UUID" method described in
 * RFC 4122 §4.3 (http://www.ietf.org/rfc/rfc4122.txt), which is
 * supported by Node's 'uuid/v3' module.
 */
class DeterministicGuids {
    constructor(seed) {
        this.seed = seed;
    }
    next() {
        const result = this.seed;
        const hashedBytes = crypto.createHash('sha1').update(this.seed, 'ascii').digest();
        const sizedBytes = new Buffer(16);
        sizedBytes.set(hashedBytes);
        this.seed = uuidParse(sizedBytes);
        return result;
    }
}
exports.DeterministicGuids = DeterministicGuids;
//# sourceMappingURL=deterministicGuids.js.map