"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
const RealtimeAnimData = {
    tracks: [{
            target: MRE.ActorPath("target").transform.app.position,
            easing: MRE.AnimationEaseCurves.EaseOutQuadratic,
            keyframes: [{
                    time: 0,
                    value: MRE.ActorPath("anchor1").transform.app.position
                }, {
                    time: 1,
                    value: MRE.ActorPath("anchor2").transform.app.position
                }, {
                    time: 2,
                    value: MRE.ActorPath("anchor3").transform.app.position
                }, {
                    time: 3,
                    value: MRE.ActorPath("anchor1").transform.app.position
                }]
        }]
};
class AnimationDynamicTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Ball should bounce between boxes as they are moved";
    }
    cleanup() {
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        const boxMesh = this.assets.createBoxMesh("box", 0.1, 0.1, 0.1);
        const ballMesh = this.assets.createSphereMesh("ball", 0.3);
        const animData = this.assets.createAnimationData("3anchors", RealtimeAnimData);
        const anchorRoot = MRE.Actor.Create(this.app.context, { actor: {
                name: "anchorRoot",
                parentId: root.id,
                transform: { local: { position: { y: 1, z: -1 } } },
                appearance: { meshId: boxMesh.id },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                grabbable: true
            } });
        const anchor1 = MRE.Actor.Create(this.app.context, { actor: {
                name: "anchor1",
                parentId: anchorRoot.id,
                transform: { local: { position: { y: 0.5 } } },
                appearance: { meshId: boxMesh.id },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                grabbable: true
            } });
        const anchor2 = MRE.Actor.Create(this.app.context, { actor: {
                name: "anchor2",
                parentId: anchorRoot.id,
                transform: { local: { position: { x: -0.433, y: -0.25 } } },
                appearance: { meshId: boxMesh.id },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                grabbable: true
            } });
        const anchor3 = MRE.Actor.Create(this.app.context, { actor: {
                name: "anchor3",
                parentId: anchorRoot.id,
                transform: { local: { position: { x: 0.433, y: -0.25 } } },
                appearance: { meshId: boxMesh.id },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                grabbable: true
            } });
        const ball = MRE.Actor.Create(this.app.context, { actor: {
                name: "ball",
                parentId: root.id,
                appearance: { meshId: ballMesh.id }
            } });
        animData.bind({ target: ball, anchor1, anchor2, anchor3 }, { isPlaying: true, wrapMode: MRE.AnimationWrapMode.Loop });
        await this.stoppedAsync();
        return true;
    }
}
exports.default = AnimationDynamicTest;
//# sourceMappingURL=animation-dynamic-test.js.map