"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
const BounceHeightKeyframes = [
    { time: 0, value: 0 },
    { time: 0.5, value: 1.1 },
    { time: 0.85, value: 0.1, easing: MRE.AnimationEaseCurves.EaseInQuadratic },
    { time: 1, value: 0 }
];
const BounceRotKeyframes = [
    { time: 0, value: MRE.Quaternion.Identity() },
    { time: 0.33, value: MRE.Quaternion.FromEulerAngles(0, 2 * Math.PI / 3, 0) },
    { time: 0.67, value: MRE.Quaternion.FromEulerAngles(0, 4 * Math.PI / 3, 0) },
    { time: 1, value: MRE.Quaternion.Identity() }
];
const BounceScaleKeyframes = [
    { time: 0, value: { x: 1.33, y: 0.667, z: 1.33 }, easing: MRE.AnimationEaseCurves.EaseInQuadratic },
    { time: 0.15, value: { x: 0.667, y: 1.33, z: 0.667 } },
    { time: 0.85, value: { x: 0.667, y: 1.33, z: 0.667 }, easing: MRE.AnimationEaseCurves.Step },
    { time: 1, value: { x: 1.33, y: 0.667, z: 1.33 } },
];
class AnimationScaleTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Animate multiple properties of multiple actors";
    }
    cleanup() {
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        this.boxMesh = this.assets.createBoxMesh("box", 0.3, 0.3, 0.3);
        // create cubes
        const targets = {
            cube0: this.createCube(root, { x: -0.5, y: 0.05, z: -0.5 }),
            cube1: this.createCube(root, { x: 0, y: 0.05, z: -0.5 }),
            cube2: this.createCube(root, { x: 0.5, y: 0.05, z: -0.5 }),
            cube3: this.createCube(root, { x: -0.75, y: 0.05, z: -1 }),
            cube4: this.createCube(root, { x: -0.25, y: 0.05, z: -1 }),
            cube5: this.createCube(root, { x: 0.25, y: 0.05, z: -1 }),
            cube6: this.createCube(root, { x: 0.75, y: 0.05, z: -1 }),
            cube7: this.createCube(root, { x: -0.5, y: 0.05, z: -1.5 }),
            cube8: this.createCube(root, { x: 0, y: 0.05, z: -1.5 }),
            cube9: this.createCube(root, { x: 0.5, y: 0.05, z: -1.5 }),
        };
        // create anim
        const animData = this.assets.createAnimationData("bounce", { tracks: this.createAnimTracks(10) });
        animData.bind(targets, { isPlaying: true, wrapMode: MRE.AnimationWrapMode.Loop });
        await this.stoppedAsync();
        return true;
    }
    createCube(root, position) {
        const cube = MRE.Actor.Create(this.app.context, { actor: {
                name: "Cube",
                parentId: root.id,
                appearance: { meshId: this.boxMesh.id },
                transform: {
                    local: {
                        position,
                        rotation: { y: Math.random() * Math.PI * 2 }
                    }
                },
            } });
        return cube;
    }
    createAnimTracks(targetCount) {
        const tracks = [];
        for (let i = 0; i < targetCount; i++) {
            tracks.push({
                target: MRE.ActorPath(`cube${i}`).transform.local.position.y,
                keyframes: BounceHeightKeyframes,
                easing: MRE.AnimationEaseCurves.EaseOutQuadratic,
                relative: true
            }, {
                target: MRE.ActorPath(`cube${i}`).transform.local.rotation,
                keyframes: BounceRotKeyframes,
                easing: MRE.AnimationEaseCurves.Linear,
                relative: true
            }, {
                target: MRE.ActorPath(`cube${i}`).transform.local.scale,
                keyframes: BounceScaleKeyframes,
                easing: MRE.AnimationEaseCurves.EaseOutQuadratic
            });
        }
        return tracks;
    }
}
exports.default = AnimationScaleTest;
//# sourceMappingURL=animation-scale-test.js.map