"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeAccessPath = void 0;
function safeAccessPath(obj, ...path) {
    for (const part of path) {
        if (!obj[part]) {
            return undefined;
        }
        else {
            obj = obj[part];
        }
    }
    return obj;
}
exports.safeAccessPath = safeAccessPath;
//# sourceMappingURL=safeAccessPath.js.map