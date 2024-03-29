"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class ClockSyncTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Digital clock face from animating text strips";
    }
    cleanup() {
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        const textScale = 0.15;
        const boxYPosition = 20;
        const boxHeight = 20 * textScale;
        const boxWidth = 10 * textScale;
        const boxGap = textScale * 0.6;
        const lineHeight = 1.20; // magic value based on default font
        // Make a root object.
        const tester = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                transform: {
                    local: {
                        position: { y: -1.5, z: -0.5 }
                    }
                }
            }
        });
        const mesh = this.assets.createBoxMesh('box', boxWidth, boxHeight, 0.2);
        MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: tester.id,
                appearance: {
                    meshId: mesh.id
                },
                transform: {
                    local: {
                        position: { x: 0.0, y: boxYPosition * textScale + (boxHeight / 2 + boxGap), z: 0.05 }
                    }
                }
            }
        });
        MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: tester.id,
                appearance: {
                    meshId: mesh.id
                },
                transform: {
                    local: {
                        position: { x: 0.0, y: boxYPosition * textScale - (boxHeight / 2 + boxGap), z: 0.05 }
                    }
                }
            }
        });
        // Create the digits.
        const meshHundredths = this.createAnimatableDigit('hundredths', '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n0', tester.id);
        const meshTenths = this.createAnimatableDigit('tenths', '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n0', tester.id);
        const meshSeconds = this.createAnimatableDigit('seconds', '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n0', tester.id);
        const mesh10Seconds = this.createAnimatableDigit('10seconds', '0\n1\n2\n3\n4\n5\n0', tester.id);
        const meshMinutes = this.createAnimatableDigit('minutes', '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n0', tester.id);
        const mesh10Minutes = this.createAnimatableDigit('10minutes', '0\n1\n2\n3\n4\n5\n0', tester.id);
        const meshHours = this.createAnimatableDigit('hours', '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n0\n1\n2\n3\n0', tester.id);
        const mesh10Hours = this.createAnimatableDigit('10hours', ' \n1\n2\n ', tester.id);
        // Make a handy array of all the digits.
        const actors = [
            meshHundredths, meshTenths, meshSeconds, mesh10Seconds, meshMinutes, mesh10Minutes, meshHours, mesh10Hours
        ];
        // Build animations.
        const yOffset = boxYPosition + lineHeight * 0.5;
        this.buildDigitAnimation(meshHundredths, 4.25, yOffset, 1 / 100, 10, 10, lineHeight, textScale);
        this.buildDigitAnimation(meshTenths, 3.25, yOffset, 1 / 10, 10, 10, lineHeight, textScale);
        this.buildDigitAnimation(meshSeconds, 1.75, yOffset, 1, 10, 10, lineHeight, textScale);
        this.buildDigitAnimation(mesh10Seconds, 0.75, yOffset, 10, 6, 6, lineHeight, textScale);
        this.buildDigitAnimation(meshMinutes, -0.75, yOffset, 60, 10, 10, lineHeight, textScale);
        this.buildDigitAnimation(mesh10Minutes, -1.75, yOffset, 10 * 60, 6, 6, lineHeight, textScale);
        this.buildDigitAnimation(meshHours, -3.25, yOffset, 60 * 60, 24, 24, lineHeight, textScale);
        this.buildDigitAnimation(mesh10Hours, -4.25, yOffset, 10 * 60 * 60, 3, 2.4, lineHeight, textScale);
        // Start the animations.
        actors.forEach(actor => actor.targetingAnimationsByName.get(actor.name + "Anim").play());
        await this.stoppedAsync();
        // Stop the animations.
        actors.forEach(actor => actor.targetingAnimationsByName.get(actor.name + "Anim").play());
        return true;
    }
    createAnimatableDigit(name, digits, parentId) {
        return MRE.Actor.Create(this.app.context, {
            actor: {
                name,
                parentId,
                text: {
                    contents: digits,
                    anchor: MRE.TextAnchorLocation.TopCenter,
                    height: 0.15
                }
            }
        });
    }
    buildDigitAnimation(mesh, xOffset, yOffset, secondsPerStep, digits, frameCount, lineHeight, scale) {
        const keyframes = [];
        // test: set to 0.01 to speed up 100x
        const timeScale = 1.0;
        const interpolationTimeSeconds = 0.1;
        // insert 2 keyframes per digit - start and (end-interpolationtime).
        // Special case is the very last digit,
        // which only inserts a start key, as the animation then snaps back to start at the rollover time
        for (let i = 0; i <= digits; ++i) {
            const value = {
                x: (xOffset) * scale,
                y: (yOffset + i * lineHeight) * scale,
                z: 0,
            };
            let frameNumber = i;
            if (i >= frameCount) {
                frameNumber = frameCount;
            }
            keyframes.push({
                time: timeScale * frameNumber * secondsPerStep,
                value
            });
            if (i < frameCount && secondsPerStep >= 1) {
                let frameNumber1 = i + 1;
                if (i + 1 >= frameCount) {
                    frameNumber1 = frameCount;
                }
                keyframes.push({
                    time: timeScale * (frameNumber1 * secondsPerStep - interpolationTimeSeconds),
                    value
                });
            }
        }
        this.assets.createAnimationData(mesh.name + "Anim", {
            tracks: [{
                    target: MRE.ActorPath('target').transform.local.position,
                    keyframes
                }]
        }).bind({ 'target': mesh }, { wrapMode: MRE.AnimationWrapMode.Loop });
    }
}
exports.default = ClockSyncTest;
//# sourceMappingURL=clock-sync-test.js.map