"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class PhysicsStackTest extends test_1.Test {
    constructor(numBoxes, boxSize, isMixedOwnership, completeOwnershipOnGrab, app, baseUrl, user) {
        super(app, baseUrl, user);
        this.app = app;
        this.baseUrl = baseUrl;
        this.user = user;
        this.expectedResultDescription = "Stable stack of rigid body boxes.";
        this.rigidBodyActors = new Set();
        this.completeOwnershipOnGrab = completeOwnershipOnGrab;
        this.assets = new MRE.AssetContainer(this.app.context);
        this.materials = [
            this.assets.createMaterial('red', { color: MRE.Color3.Red() }),
            this.assets.createMaterial('blue', { color: MRE.Color3.Blue() }),
            this.assets.createMaterial('green', { color: MRE.Color3.Green() }),
        ];
        this.numBoxes = numBoxes;
        this.boxSize = boxSize;
        this.numOwners = isMixedOwnership ? 2 : 1;
    }
    async run(root) {
        for (let i = 0; i < this.app.context.users.length; i++) {
            const index = Math.min(i, this.materials.length - 1);
            this.createLabel(root, this.materials[index], this.app.context.users[i].id);
            if (i === 0) {
                this.createCube(root, this.boxSize, new MRE.Vector3(1.2, this.boxSize * 0.5, -1), this.app.context.users[i].id, this.materials[i]);
            }
            else if (i === 1) {
                this.createCube(root, this.boxSize, new MRE.Vector3(-1.2, this.boxSize * 0.5, -1), this.app.context.users[i].id, this.materials[i]);
            }
        }
        const numUsers = Math.min(this.numOwners, this.app.context.users.length);
        this.createStack(root, this.boxSize, this.numBoxes, numUsers, this.app.context.users, this.materials);
        await this.stoppedAsync();
        return true;
    }
    cleanup() {
        clearInterval(this.interval);
        this.assets.unload();
    }
    createLabel(root, material, userId) {
        MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'label',
                parentId: root.id,
                exclusiveToUser: userId,
                transform: { local: { position: { y: 3.5 } } },
                text: {
                    contents: material.name,
                    height: 0.5,
                    anchor: MRE.TextAnchorLocation.TopCenter,
                    color: material.color
                }
            }
        });
    }
    createStack(root, size, count, numUsers, users, materials) {
        const position = new MRE.Vector3(0, size * 0.5, -1);
        for (let i = 0; i < count; i++) {
            const userIndex = i % numUsers;
            this.createCube(root, size, position, users[userIndex].id, materials[userIndex]);
            position.y += size;
        }
    }
    createCube(root, size, position, userId, material) {
        const actor = MRE.Actor.Create(this.app.context, {
            actor: {
                owner: userId,
                parentId: root.id,
                name: "box",
                grabbable: true,
                appearance: {
                    meshId: this.assets.createBoxMesh('box', size, size, size).id,
                    materialId: material.id
                },
                transform: {
                    local: { position: position }
                },
                rigidBody: {
                    mass: 1,
                },
                collider: {
                    geometry: { shape: MRE.ColliderType.Auto },
                    bounciness: 0.0, dynamicFriction: 0.5, staticFriction: 0.5
                }
            }
        });
        this.rigidBodyActors.add(actor);
        if (!this.completeOwnershipOnGrab) {
            actor.onGrab('begin', (user) => {
                let u = 0;
                for (; u < this.app.context.users.length; u++) {
                    if (user.id === this.app.context.users[u].id) {
                        break;
                    }
                }
                actor.appearance.materialId = this.materials[u].id;
            });
        }
        else {
            actor.onGrab('begin', (user) => {
                let u = 0;
                for (; u < this.app.context.users.length; u++) {
                    if (user.id === this.app.context.users[u].id) {
                        break;
                    }
                }
                this.rigidBodyActors.forEach((value) => {
                    value.owner = user.id;
                    value.appearance.materialId = this.materials[u].id;
                });
            });
        }
    }
}
exports.default = PhysicsStackTest;
//# sourceMappingURL=physics-stack-test.js.map