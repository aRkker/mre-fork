"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class AssetEarlyAssignmentTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Unlit colored & textured sphere";
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        const tex = this.assets.createTexture('uvgrid', {
            uri: `${this.baseUrl}/uv-grid.png`
        });
        const mat = this.assets.createMaterial('blue', {
            color: MRE.Color3.Black(),
            emissiveColor: MRE.Color3.Blue(),
            emissiveTextureId: tex.id
        });
        const mesh = this.assets.createSphereMesh('sphere', 0.5);
        MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'sphere',
                parentId: root.id,
                appearance: {
                    meshId: mesh.id,
                    materialId: mat.id
                },
                transform: {
                    local: {
                        position: { y: 1, z: -1 }
                    }
                }
            }
        });
        await this.stoppedAsync();
        return true;
    }
    cleanup() {
        this.assets.unload();
    }
}
exports.default = AssetEarlyAssignmentTest;
//# sourceMappingURL=asset-early-assignment-test.js.map