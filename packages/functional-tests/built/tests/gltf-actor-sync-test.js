"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class GltfActorSyncTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Text should be visible";
    }
    cleanup() {
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        const actorRoot = MRE.Actor.CreateFromGltf(this.assets, {
            uri: `${this.baseUrl}/monkey.glb`,
            colliderType: 'box',
            actor: {
                name: 'glTF',
                parentId: root.id,
                text: {
                    contents: 'Peek-a-boo!',
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.BottomCenter
                },
                transform: {
                    local: {
                        position: { y: 1.5, z: -1 },
                        scale: { x: 0.5, y: 0.5, z: 0.5 }
                    }
                }
            }
        });
        await actorRoot.created();
        // move monkey head up
        const monkeyRoot = actorRoot.children[0];
        if (!monkeyRoot) {
            throw new Error('glTF node actor not found');
        }
        monkeyRoot.transform.local.position.y = -1;
        monkeyRoot.transform.local.rotation = MRE.Quaternion.FromEulerAngles(0, Math.PI, 0);
        await this.stoppedAsync();
        return true;
    }
}
exports.default = GltfActorSyncTest;
//# sourceMappingURL=gltf-actor-sync-test.js.map