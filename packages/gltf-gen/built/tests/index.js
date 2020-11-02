"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/* eslint-disable */
const validator = require('gltf-validator');
const empty_1 = __importDefault(require("./empty"));
const material_1 = __importDefault(require("./material"));
const prim_dupe_1 = __importDefault(require("./prim-dupe"));
const triangle_1 = __importDefault(require("./triangle"));
const meshprimitive_1 = __importDefault(require("./meshprimitive"));
const util_1 = require("./util");
(async () => {
    const tests = [new empty_1.default(), new triangle_1.default(), new prim_dupe_1.default(), new material_1.default(), new meshprimitive_1.default()];
    for (const test of tests) {
        console.log(`+==========================================+
| ${test.name.padEnd(40, ' ')} |
+==========================================+`);
        let time = process.hrtime();
        let result;
        try {
            result = test.run();
        }
        catch (ex) {
            console.log('Test failed', ex);
            continue;
        }
        time = process.hrtime(time);
        console.log(`Test completed in ${time[0] * 1000 + time[1] / 1000} ms\n`);
        const jsonStart = 20;
        const jsonLength = result.readInt32LE(12);
        if (test.shouldPrintJson) {
            console.log('Output JSON:');
            console.log('-' + result.toString('utf8', jsonStart, jsonStart + jsonLength) + '-\n');
        }
        if (test.shouldPrintBuffer) {
            console.log('Output Data:');
            util_1.prettyPrintBuffer(result, jsonStart + jsonLength + 8);
        }
        const validationResult = await validator.validateBytes(new Uint8Array(result));
        console.log('Validation issues:', JSON.stringify(validationResult.issues.messages, null, '  '), '\n');
    }
})();
//# sourceMappingURL=index.js.map