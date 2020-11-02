"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
const AnimData = { tracks: [{
            target: MRE.ActorPath("target").transform.local.rotation,
            relative: true,
            easing: MRE.AnimationEaseCurves.Linear,
            keyframes: [
                { time: 1, value: MRE.Quaternion.FromEulerAngles(0, 0, -Math.PI / 2) }
            ]
        }] };
class AnimationRelativeTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Should spin smoothly";
    }
    cleanup() {
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        const animData = this.assets.createAnimationData('anim', AnimData);
        const mesh = this.assets.createBoxMesh('mesh', 1, 0.5, 0.1);
        const target = MRE.Actor.Create(this.app.context, { actor: {
                name: "target",
                parentId: root.id,
                appearance: { meshId: mesh.id },
                transform: { local: { position: { y: 1, z: -1 } } }
            } });
        animData.bind({ target }, { wrapMode: MRE.AnimationWrapMode.Loop, isPlaying: true });
        await this.stoppedAsync();
        return true;
    }
}
exports.default = AnimationRelativeTest;
//# sourceMappingURL=animation-relative-test.js.map