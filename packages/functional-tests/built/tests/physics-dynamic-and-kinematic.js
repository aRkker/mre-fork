"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class PhysicsDynamicVsKinematicTest extends test_1.Test {
    constructor(app, baseUrl, user) {
        super(app, baseUrl, user);
        this.app = app;
        this.baseUrl = baseUrl;
        this.user = user;
        this.expectedResultDescription = "Synchronized behavior on each client";
        this.assets = new MRE.AssetContainer(this.app.context);
        this.dynamic = this.assets.createMaterial('dynamic', { color: MRE.Color3.Yellow() });
        this.kinematic = this.assets.createMaterial('kinematic', { color: MRE.Color3.Purple() });
    }
    async run(root) {
        this.numBoxes = 0;
        const ball = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'ball',
                parentId: root.id,
                appearance: {
                    meshId: this.assets.createSphereMesh('sphere', 0.25).id,
                    materialId: this.kinematic.id
                },
                transform: {
                    local: { position: { y: 0.5, z: -1.0 } }
                },
                rigidBody: {
                    isKinematic: true
                },
                collider: {
                    geometry: { shape: MRE.ColliderType.Auto },
                    bounciness: 0.0, dynamicFriction: 0.5, staticFriction: 0.5
                }
            }
        });
        const ballAnim = this.assets.animationData.find(ad => ad.name === 'swing')
            || this.assets.createAnimationData('swing', {
                tracks: [{
                        target: MRE.ActorPath('target').transform.local.position.x,
                        keyframes: [
                            { time: 0.0, value: 0.75 },
                            { time: 1.0, value: -0.75 },
                            { time: 2.0, value: 0.75 }
                        ]
                    }]
            });
        const anim = this.app.context.animations[0];
        ballAnim.bind({ target: ball }, !anim ? {
            wrapMode: MRE.AnimationWrapMode.Loop,
            isPlaying: true
        } : {
            wrapMode: MRE.AnimationWrapMode.Loop,
            basisTime: anim.basisTime,
            time: anim.time,
            weight: anim.weight
        });
        this.boxMeshId = this.assets.createBoxMesh('box', 0.25, 0.25, 0.25).id;
        this.interval = setInterval(() => this.spawnBall(root), 1000);
        await this.stoppedAsync();
        return true;
    }
    cleanup() {
        clearInterval(this.interval);
        this.assets.unload();
    }
    spawnBall(root) {
        if (this.numBoxes >= 50) {
            return;
        }
        this.numBoxes++;
        const userIndex = Math.floor(Math.random() * (this.app.context.users.length - 1)) + 1;
        const ballOrBox = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                grabbable: true,
                appearance: {
                    meshId: this.boxMeshId,
                    materialId: this.dynamic.id
                },
                owner: this.app.context.users[userIndex].id,
                transform: {
                    local: {
                        position: {
                            x: -1.0 / 2 + 1.0 * Math.random(),
                            y: 2.0 + Math.random(),
                            z: -1.0
                        }
                    }
                },
                rigidBody: {
                    mass: 3,
                    // give the box or spere some initial velocities
                    angularVelocity: {
                        x: 10 * Math.random() - 5.0, y: 10.0 * Math.random() - 5.0,
                        z: 10 * Math.random() - 5.0
                    },
                    constraints: [MRE.RigidBodyConstraints.None]
                },
                collider: {
                    geometry: { shape: MRE.ColliderType.Auto },
                    bounciness: 0.0, dynamicFriction: 0.5, staticFriction: 0.5
                }
            }
        });
        setTimeout(() => {
            ballOrBox.destroy();
            this.numBoxes--;
        }, 3000);
    }
}
exports.default = PhysicsDynamicVsKinematicTest;
//# sourceMappingURL=physics-dynamic-and-kinematic.js.map