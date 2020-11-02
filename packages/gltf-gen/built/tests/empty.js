"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const GltfGen = __importStar(require(".."));
/** @hidden */
class EmptyTest {
    constructor() {
        this.name = 'Empty glTF';
        this.shouldPrintJson = false;
        this.shouldPrintBuffer = false;
    }
    run() {
        const factory = new GltfGen.GltfFactory();
        return factory.generateGLTF();
    }
}
exports.default = EmptyTest;
//# sourceMappingURL=empty.js.map