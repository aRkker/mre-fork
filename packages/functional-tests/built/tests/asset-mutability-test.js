"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const GltfGen = tslib_1.__importStar(require("@microsoft/gltf-gen"));
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const server_1 = tslib_1.__importDefault(require("../server"));
const test_1 = require("../test");
const delay_1 = tslib_1.__importDefault(require("../utils/delay"));
class AssetMutabilityTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Animate a cube's color, texture, and transparency";
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        await this.assets.loadGltf(this.generateMaterial());
        const mat = this.assets.materials[0];
        mat.alphaMode = MRE.AlphaMode.Blend;
        MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'box',
                parentId: root.id,
                appearance: {
                    meshId: this.assets.createBoxMesh('box', 1, 1, 1).id,
                    materialId: mat.id
                },
                transform: {
                    local: {
                        position: { y: 1, z: -1 }
                    }
                }
            }
        });
        let direction = 1;
        let i = 0;
        while (!this.stopped) {
            mat.color.copyFrom(this.fromHSV(i / 32, 1, 1, i / 32));
            mat.mainTextureOffset.set(i / 32, i / 32);
            mat.mainTextureScale.set(1 - i / 32, 1 - i / 32);
            i += direction;
            if (i === 0 || i === 64) {
                direction *= -1;
            }
            await delay_1.default(100);
        }
        return true;
    }
    generateMaterial() {
        const material = new GltfGen.Material({
            metallicFactor: 0,
            baseColorTexture: new GltfGen.Texture({
                source: new GltfGen.Image({
                    uri: `${this.baseUrl}/uv-grid.png` // alternate form (don't embed)
                })
            }),
            alphaMode: GltfGen.AlphaMode.Blend
        });
        const gltfFactory = new GltfGen.GltfFactory(null, null, [material]);
        return server_1.default.registerStaticBuffer('assets.glb', gltfFactory.generateGLTF());
    }
    fromHSV(h, s, v, a) {
        // from wikipedia: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
        function f(n, k = (n + h * 6) % 6) {
            return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
        }
        return new MRE.Color4(f(5), f(3), f(1), a);
    }
    cleanup() {
        this.assets.unload();
    }
}
exports.default = AssetMutabilityTest;
//# sourceMappingURL=asset-mutability-test.js.map