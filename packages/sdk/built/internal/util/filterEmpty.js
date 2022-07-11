"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterEmpty = void 0;
/**
 * @hidden
 * If `obj` is an empty object, return undefined.
 */
function filterEmpty(obj) {
    if (typeof obj === 'object' && obj !== null && !Object.keys(obj).length) {
        return undefined;
    }
    else {
        return obj;
    }
}
exports.filterEmpty = filterEmpty;
//# sourceMappingURL=filterEmpty.js.map