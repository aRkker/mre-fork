"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("../test");
class FailureTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Fails";
    }
    run() {
        return Promise.reject(new Error("Throwing an exception"));
    }
}
exports.default = FailureTest;
//# sourceMappingURL=failure-test.js.map