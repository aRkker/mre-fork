"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class PhysicsFrictionTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Boxes slide with different frictions.";
        this.materials = [];
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        this.materials.push(this.assets.createMaterial('mat1', { color: MRE.Color3.FromHexString('#2b7881').toColor4() }));
        this.materials.push(this.assets.createMaterial('mat2', { color: MRE.Color3.FromHexString('#11948b').toColor4() }));
        this.materials.push(this.assets.createMaterial('mat3', { color: MRE.Color3.FromHexString('#664a72').toColor4() }));
        this.materials.push(this.assets.createMaterial('mat4', { color: MRE.Color3.FromHexString('#89133d').toColor4() }));
        this.materials.push(this.assets.createMaterial('mat5', { color: MRE.Color3.FromHexString('#c7518e').toColor4() }));
        this.createSlopePlane(root, 2, 1.25);
        this.interval = setInterval(() => this.spawnBox(root, 1.5, 1.5), 500);
        await this.stoppedAsync();
        return true;
    }
    cleanup() {
        clearInterval(this.interval);
        this.assets.unload();
    }
    createSlopePlane(root, width, height) {
        // Create a box as a slope for sliding
        const box = this.assets.createBoxMesh('box', 2.5, 0.05, 2.5);
        this.slopePlane = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                appearance: {
                    meshId: box.id
                },
                transform: {
                    app: {
                        position: { x: 0.0, y: 0.5, z: -0.8 },
                        rotation: { x: 0.966, y: 0.0, z: 0.0, w: 0.259 }
                    } // 30 degree around Y
                },
                collider: {
                    geometry: { shape: MRE.ColliderType.Auto },
                    bounciness: 0.0, dynamicFriction: 0.1, staticFriction: 0.1
                }
            }
        });
    }
    spawnBox(root, width, height, radius = 0.1, killTimeout = 5000) {
        const boxId = this.assets.createBoxMesh('box', 1.5 * radius, 1.8 * radius, 2.1 * radius).id;
        // boxes for the slope and with the same dynamic and static friction
        const friction = 0.7 * Math.random();
        const box = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                appearance: {
                    meshId: boxId,
                    materialId: this.materials[Math.floor(Math.random() * this.materials.length)].id
                },
                grabbable: true,
                transform: {
                    local: {
                        position: {
                            x: -width / 2 + width * Math.random(),
                            y: height, z: -(-0.1 + 0.2 * Math.random())
                        }
                    }
                },
                rigidBody: {
                    mass: 3,
                    angularVelocity: {
                        x: 50 * Math.random() - 25.0, y: 50.0 * Math.random() - 25.0,
                        z: 50 * Math.random() - 25.0
                    },
                    velocity: { x: 0.0, y: 0.0, z: 0.0 },
                    constraints: [MRE.RigidBodyConstraints.None]
                },
                collider: {
                    geometry: { shape: MRE.ColliderType.Auto },
                    bounciness: 0.0, dynamicFriction: friction, staticFriction: friction
                }
            }
        });
        setTimeout(() => {
            box.destroy();
        }, killTimeout);
    }
}
exports.default = PhysicsFrictionTest;
//# sourceMappingURL=physics-friction-test.js.map