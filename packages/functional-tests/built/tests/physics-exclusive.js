"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class PhysicsExclusiveRigidBodyTest extends test_1.Test {
    constructor(fixUpMass, app, baseUrl, user) {
        super(app, baseUrl, user);
        this.app = app;
        this.baseUrl = baseUrl;
        this.user = user;
        this.expectedResultDescription = "Exclusive should not impact shared rigid bodies";
        this.assets = new MRE.AssetContainer(this.app.context);
        this.fixUpMass = fixUpMass;
        this.sharedMaterial = this.assets.createMaterial('shared', { color: MRE.Color3.Blue() });
        this.exclusiveMaterial = this.assets.createMaterial('exclusive', { color: MRE.Color3.Magenta() });
    }
    async run(root) {
        this.createLabels(root);
        const userId = this.app.context.users[1].id;
        const ownerId0 = this.app.context.users[0].id;
        const ownerId1 = this.app.context.users.length > 1 ?
            this.app.context.users[1].id : this.app.context.users[0].id;
        this.createCube(root, 0.5, new MRE.Vector3(-0.7, 0.25, -1.0), this.exclusiveMaterial, userId);
        this.createCube(root, 0.5, new MRE.Vector3(0.0, 0.25, -1.0), this.exclusiveMaterial, userId);
        this.createCube(root, 0.5, new MRE.Vector3(0.7, 0.25, -1.0), this.exclusiveMaterial, userId);
        this.createCube(root, 0.5, new MRE.Vector3(-0.7, 0.75, -1.0), this.exclusiveMaterial, userId);
        this.createCube(root, 0.5, new MRE.Vector3(0.0, 0.75, -1.0), this.sharedMaterial, null, ownerId0);
        this.createCube(root, 0.5, new MRE.Vector3(0.7, 0.75, -1.0), this.sharedMaterial, null, ownerId1);
        await this.stoppedAsync();
        return true;
    }
    cleanup() {
        clearInterval(this.interval);
        this.assets.unload();
    }
    createLabels(root) {
        MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'label',
                parentId: root.id,
                transform: { local: { position: { x: -1.0, y: 3.5 } } },
                text: {
                    contents: "shared",
                    height: 0.5,
                    anchor: MRE.TextAnchorLocation.TopCenter,
                    color: this.sharedMaterial.color
                }
            }
        });
        MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'label',
                parentId: root.id,
                transform: { local: { position: { x: 1.0, y: 3.5 } } },
                text: {
                    contents: "exclusive",
                    height: 0.5,
                    anchor: MRE.TextAnchorLocation.TopCenter,
                    color: this.exclusiveMaterial.color
                }
            }
        });
    }
    createCube(root, size, position, material, user, owner) {
        return MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                name: "box",
                grabbable: true,
                exclusiveToUser: user,
                owner: owner,
                appearance: {
                    meshId: this.assets.createBoxMesh('box', size, size, size).id,
                    materialId: material.id
                },
                transform: {
                    local: { position: position }
                },
                rigidBody: {
                    mass: (this.fixUpMass && user !== null) ? 0.0001 : 1,
                },
                collider: {
                    geometry: { shape: MRE.ColliderType.Auto },
                    bounciness: 0.0, dynamicFriction: 0.5, staticFriction: 0.5
                }
            }
        });
    }
}
exports.default = PhysicsExclusiveRigidBodyTest;
//# sourceMappingURL=physics-exclusive.js.map