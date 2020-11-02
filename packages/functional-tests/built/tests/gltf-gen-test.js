"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const GltfGen = tslib_1.__importStar(require("@microsoft/gltf-gen"));
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const server_1 = tslib_1.__importDefault(require("../server"));
const test_1 = require("../test");
class GltfGenTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "A textured sphere";
    }
    cleanup() {
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        const mat = new GltfGen.Material({
            baseColorFactor: new MRE.Color4(1, 1, 1, 0.7),
            baseColorTexture: new GltfGen.Texture({
                source: new GltfGen.Image({
                    embeddedFilePath: path_1.resolve(__dirname, '../../public/uv-grid.png')
                    // uri: `${this.baseUrl}/uv-grid.png` // alternate form (don't embed)
                })
            }),
            alphaMode: GltfGen.AlphaMode.Blend
        });
        const sphere = new GltfGen.Node({
            name: 'sphere',
            mesh: new GltfGen.Mesh({ name: 'sphere', primitives: [new GltfGen.Sphere(0.5, 36, 18, mat)] }),
            translation: new MRE.Vector3(1, 0, 0)
        });
        const box = new GltfGen.Node({
            name: 'box',
            mesh: new GltfGen.Mesh({ name: 'box', primitives: [new GltfGen.Box(0.9, 0.9, 0.9, mat)] }),
            translation: new MRE.Vector3(0, 0, 0)
        });
        const capsule = new GltfGen.Node({
            name: 'capsule',
            mesh: new GltfGen.Mesh({ name: 'capsule', primitives: [new GltfGen.Capsule(0.3, 1, 36, 18, 0.35, mat)] }),
            translation: new MRE.Vector3(-1, 0, 0)
        });
        const quad = new GltfGen.Node({
            name: 'quad',
            mesh: new GltfGen.Mesh({ name: 'quad', primitives: [new GltfGen.Quad(2, 2, mat)] }),
            translation: new MRE.Vector3(0, 0, 0.8),
            rotation: MRE.Quaternion.FromEulerAngles(0, Math.PI, 0)
        });
        const plane = new GltfGen.Node({
            name: 'plane',
            mesh: new GltfGen.Mesh({ name: 'plane', primitives: [new GltfGen.Plane(2, 2, 10, 10, mat)] }),
            translation: new MRE.Vector3(0, -0.8, 0),
            rotation: MRE.Quaternion.FromEulerAngles(-Math.PI / 2, Math.PI, 0)
        });
        const gltfFactory = new GltfGen.GltfFactory([new GltfGen.Scene({
                nodes: [box, capsule, plane, quad, sphere]
            })]);
        MRE.Actor.CreateFromGltf(this.assets, {
            uri: server_1.default.registerStaticBuffer('test.glb', gltfFactory.generateGLTF()),
            actor: {
                parentId: root.id,
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
}
exports.default = GltfGenTest;
//# sourceMappingURL=gltf-gen-test.js.map