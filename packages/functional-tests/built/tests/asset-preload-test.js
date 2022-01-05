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
class AssetPreloadTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Two meshes juggle their materials and textures. Click to advance.";
        this.state = 0;
    }
    static AssignMat(actor, mat) {
        actor.appearance.material = mat;
        actor.children.forEach(c => this.AssignMat(c, mat));
    }
    async run(root) {
        this.root = root;
        this.assets = new MRE.AssetContainer(this.app.context);
        this.app.setOverrideText("Preloading assets");
        const [monkey, uvgrid] = await Promise.all([
            this.assets.loadGltf(this.baseUrl + '/monkey.glb', 'box'),
            this.assets.loadGltf(this.generateMaterial())
        ]);
        this.app.setOverrideText("Assets preloaded:" +
            `${this.assets.prefabs.length} prefabs, ` +
            `${this.assets.materials.length} materials, ` +
            `${this.assets.textures.length} textures`);
        await delay_1.default(1000);
        this.monkeyPrefab = monkey.find(a => a.prefab !== null).prefab;
        this.monkeyMat = monkey.find(a => a.material !== null).material;
        this.uvgridMat = uvgrid.find(a => a.material !== null).material;
        this.uvgridTex = uvgrid.find(a => a.texture !== null).texture;
        await this.cycleState();
        await this.stoppedAsync();
        return true;
    }
    async cycleState() {
        switch (this.state) {
            case 0:
                if (this.head) {
                    this.head.destroy();
                }
                if (this.sphere) {
                    this.sphere.destroy();
                }
                if (this.head || this.sphere) {
                    await delay_1.default(1000);
                }
                this.app.setOverrideText("Instantiating prefabs");
                this.setup();
                this.app.setOverrideText("Prefab instantiated");
                break;
            case 1:
                AssetPreloadTest.AssignMat(this.head, this.uvgridMat);
                AssetPreloadTest.AssignMat(this.sphere, this.monkeyMat);
                this.app.setOverrideText("Materials swapped");
                break;
            case 2:
                this.monkeyMat.mainTexture = this.uvgridTex;
                this.uvgridMat.mainTexture = null;
                this.app.setOverrideText("Textures swapped");
                break;
            case 3:
                this.monkeyMat.mainTexture = null;
                this.uvgridMat.mainTexture = null;
                this.app.setOverrideText("Textures cleared");
                break;
            case 4:
                AssetPreloadTest.AssignMat(this.head, null);
                AssetPreloadTest.AssignMat(this.sphere, null);
                this.app.setOverrideText("Materials cleared");
                break;
            default:
                throw new Error("How did we get here?");
        }
        this.state = (this.state + 1) % 5;
    }
    setup() {
        this.uvgridMat.mainTexture = this.uvgridTex;
        this.head = MRE.Actor.CreateFromPrefab(this.app.context, {
            prefabId: this.monkeyPrefab.id,
            actor: {
                parentId: this.root.id,
                transform: {
                    local: {
                        position: { x: -0.5, y: 1, z: -1 },
                        scale: { x: 0.5, y: 0.5, z: 0.5 }
                    }
                }
            }
        });
        this.sphere = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: this.root.id,
                appearance: {
                    meshId: this.assets.createSphereMesh('sphere', 0.5).id,
                    materialId: this.uvgridMat.id
                },
                transform: {
                    local: {
                        position: { x: 0.5, y: 1, z: -1 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        this.head.setBehavior(MRE.ButtonBehavior)
            .onButton("pressed", () => this.cycleState());
        this.sphere.setBehavior(MRE.ButtonBehavior)
            .onButton("pressed", () => this.cycleState());
    }
    generateMaterial() {
        const material = new GltfGen.Material({
            baseColorTexture: new GltfGen.Texture({
                source: new GltfGen.Image({
                    uri: `${this.baseUrl}/uv-grid.png` // alternate form (don't embed)
                })
            })
        });
        const gltfFactory = new GltfGen.GltfFactory(null, null, [material]);
        return server_1.default.registerStaticBuffer('uvgrid', gltfFactory.generateGLTF());
    }
    cleanup() {
        this.assets.unload();
    }
}
exports.default = AssetPreloadTest;
//# sourceMappingURL=asset-preload-test.js.map