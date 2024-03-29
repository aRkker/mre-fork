"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
const delay_1 = tslib_1.__importDefault(require("../utils/delay"));
class InputTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Hover, click, and unhover";
        this.state = 0;
        this.spinCount = 0;
        this.growAnimationData = {
            tracks: [{
                    target: MRE.ActorPath("target").transform.local.scale,
                    keyframes: [{
                            time: 0,
                            value: { x: 0.4, y: 0.4, z: 0.4 }
                        }, {
                            time: 0.3,
                            value: { x: 0.5, y: 0.5, z: 0.5 }
                        }]
                }]
        };
    }
    cleanup() {
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        MRE.Actor.Create(this.app.context, {
            actor: {
                name: "Light",
                parentId: root.id,
                light: {
                    type: 'point',
                    range: 5,
                    intensity: 2,
                    color: { r: 1, g: 0.5, b: 0.3 }
                },
                transform: {
                    local: {
                        position: { x: -2, y: 2, z: -2 }
                    }
                }
            }
        });
        // Create an actor
        this.model = MRE.Actor.CreateFromGltf(this.assets, {
            // from the glTF at the given URL, with box colliders on each mesh
            uri: `${this.baseUrl}/monkey.glb`,
            colliderType: 'box',
            // Also apply the following generic actor properties.
            actor: {
                name: 'clickable',
                parentId: root.id,
                transform: {
                    local: {
                        scale: { x: 0.4, y: 0.4, z: 0.4 },
                        position: { x: 0, y: 1, z: -1 }
                    }
                }
            }
        });
        // Create some animations on the cube.
        this.assets.createAnimationData('Grow', this.growAnimationData)
            .bind({ target: this.model });
        this.assets.createAnimationData('Spin', this.generateSpinData(0.5, MRE.Vector3.Up()))
            .bind({ target: this.model });
        // Set up cursor interaction. We add the input behavior ButtonBehavior to the cube.
        // Button behaviors have two pairs of events: hover start/stop, and click start/stop.
        const behavior = this.model.setBehavior(MRE.ButtonBehavior);
        behavior.onHover('enter', () => {
            this.state = 1;
            this.cycleState();
        });
        behavior.onButton('pressed', () => {
            this.state = 2;
            this.cycleState();
        });
        behavior.onHover('exit', () => {
            this.state = 0;
            this.cycleState();
        });
        this.cycleState();
        await this.stoppedAsync();
        this.model.setBehavior(null);
        this.app.setOverrideText("Thank you for your cooperation");
        await delay_1.default(1.2 * 1000);
        return true;
    }
    cycleState() {
        const growAnim = this.model.targetingAnimationsByName.get('Grow');
        const spinAnim = this.model.targetingAnimationsByName.get('Spin');
        switch (this.state) {
            case 0:
                growAnim.time = growAnim.data.duration();
                growAnim.speed = -1;
                growAnim.play();
                this.app.setOverrideText("Please Hover");
                break;
            case 1:
                growAnim.time = 0;
                growAnim.speed = 1;
                growAnim.play();
                this.app.setOverrideText("Please Click");
                break;
            case 2:
                spinAnim.play(true);
                this.spinCount++;
                this.app.setOverrideText("Please Unhover");
                break;
            default:
                throw new Error("How did we get here?");
        }
    }
    generateSpinData(duration, axis) {
        return {
            tracks: [{
                    target: MRE.ActorPath("target").transform.local.rotation,
                    relative: true,
                    keyframes: [{
                            time: 0 * duration,
                            value: MRE.Quaternion.RotationAxis(axis, 0)
                        }, {
                            time: 0.5 * duration,
                            value: MRE.Quaternion.RotationAxis(axis, Math.PI / 2)
                        }, {
                            time: 1 * duration,
                            value: MRE.Quaternion.RotationAxis(axis, Math.PI)
                        }]
                }]
        };
    }
}
exports.default = InputTest;
//# sourceMappingURL=input-test.js.map