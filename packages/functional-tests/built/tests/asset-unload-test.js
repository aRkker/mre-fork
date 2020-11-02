"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class AssetUnloadTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Unload assets one at a time";
        this.state = 0;
    }
    async run(root) {
        this.prim = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'sphere',
                parentId: root.id,
                transform: {
                    local: {
                        position: { y: 1, z: -1 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Sphere, radius: 0.5 } }
            }
        });
        this.setup();
        this.prim.setBehavior(MRE.ButtonBehavior).onClick(() => this.cycleState());
        await this.stoppedAsync();
        return true;
    }
    cleanup() {
        if (this.assetContainer1) {
            this.assetContainer1.unload();
        }
        if (this.assetContainer2) {
            this.assetContainer2.unload();
        }
        if (this.assetContainer3) {
            this.assetContainer3.unload();
        }
    }
    setup() {
        this.assetContainer1 = new MRE.AssetContainer(this.app.context);
        this.assetContainer2 = new MRE.AssetContainer(this.app.context);
        this.assetContainer3 = new MRE.AssetContainer(this.app.context);
        this.app.setOverrideText("Colored & textured sphere");
        const tex = this.assetContainer1.createTexture('uvgrid', {
            uri: `${this.baseUrl}/uv-grid.png`
        });
        const mat = this.assetContainer2.createMaterial('blue', {
            color: MRE.Color3.Blue(),
            mainTextureId: tex.id
        });
        const mesh = this.assetContainer3.createSphereMesh('sphere', 0.5);
        this.prim.appearance.mesh = mesh;
        this.prim.appearance.material = mat;
    }
    cycleState() {
        switch (++this.state % 4) {
            case 0:
                this.setup();
                break;
            case 1:
                this.assetContainer1.unload();
                this.assetContainer1 = null;
                this.app.setOverrideText("Colored sphere");
                break;
            case 2:
                this.assetContainer2.unload();
                this.assetContainer2 = null;
                this.app.setOverrideText("Plain sphere");
                break;
            case 3:
                this.assetContainer3.unload();
                this.assetContainer3 = null;
                this.app.setOverrideText("Collider only");
                break;
            default:
                throw new Error("How did we get here?");
        }
    }
}
exports.default = AssetUnloadTest;
//# sourceMappingURL=asset-unload-test.js.map