"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetInternal = void 0;
/**
 * @hidden
 */
class AssetInternal {
    constructor(asset) {
        this.asset = asset;
        this.observing = true;
    }
    getPatchAndReset() {
        const patch = this.patch;
        if (patch) {
            patch.id = this.asset.id;
            delete this.patch;
        }
        return patch;
    }
}
exports.AssetInternal = AssetInternal;
//# sourceMappingURL=assetInternal.js.map