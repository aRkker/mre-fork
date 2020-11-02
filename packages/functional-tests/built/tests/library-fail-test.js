"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class LibraryFailTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Fails";
    }
    async run() {
        const actor = MRE.Actor.CreateFromLibrary(this.app.context, { resourceId: 'artifact:abdc' });
        await actor.created();
        return true;
    }
}
exports.default = LibraryFailTest;
//# sourceMappingURL=library-fail-test.js.map