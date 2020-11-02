"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
function destroyActors(actors) {
    var _a;
    if (!Array.isArray(actors)) {
        actors = [actors];
    }
    for (const actor of actors) {
        (_a = actor) === null || _a === void 0 ? void 0 : _a.destroy();
    }
    return [];
}
exports.default = destroyActors;
//# sourceMappingURL=destroyActors.js.map