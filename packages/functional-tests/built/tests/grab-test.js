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
class GrabTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Different grabbable items.";
        this.state = 0;
        this.clickCount = 0;
        this.SCALE = 0.2;
        this.clickAnimationData = {
            tracks: [{
                    target: MRE.ActorPath("target").transform.local.scale,
                    keyframes: [{
                            time: 0,
                            value: { x: this.SCALE, y: this.SCALE, z: this.SCALE }
                        }, {
                            time: 0.1,
                            value: { x: this.SCALE + 0.1, y: this.SCALE + 0.1, z: this.SCALE + 0.1 }
                        }, {
                            time: 0.2,
                            value: { x: this.SCALE, y: this.SCALE, z: this.SCALE }
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
                        scale: { x: this.SCALE, y: this.SCALE, z: this.SCALE },
                        position: { x: 0, y: 1, z: -1 }
                    }
                }
            }
        });
        // Create some animations on the cube.
        this.assets.createAnimationData('OnClick', this.clickAnimationData)
            .bind({ target: this.model });
        // Set up cursor interaction. We add the input behavior ButtonBehavior to the cube.
        // Button behaviors have two pairs of events: hover start/stop, and click start/stop.
        const behavior = this.model.setBehavior(MRE.ButtonBehavior);
        behavior.onClick(() => {
            this.state = 3;
            this.cycleState();
        });
        // Make the actor grabbable and update state based on grab.
        this.model.grabbable = true;
        this.model.onGrab('begin', () => {
            this.state = 1;
            this.cycleState();
        });
        this.model.onGrab('end', () => {
            this.state = 2;
            this.cycleState();
        });
        // Create two grabbable cubes that can be played with at will.  Position left
        // anr right of the monkey.
        const boxMesh = this.assets.createBoxMesh('box', 0.5, 0.5, 0.5);
        for (const cube of [{ name: 'Cube1', x: -1 }, { name: 'Cube2', x: 1 }]) {
            MRE.Actor.Create(this.app.context, {
                actor: {
                    name: cube.name,
                    parentId: root.id,
                    appearance: {
                        meshId: boxMesh.id
                    },
                    collider: { geometry: { shape: MRE.ColliderType.Auto } },
                    transform: { local: { position: { x: cube.x, y: 1, z: -1 } } }
                }
            }).grabbable = true;
        }
        this.cycleState();
        await this.stoppedAsync();
        this.model.setBehavior(null);
        this.app.setOverrideText("Thank you for your cooperation");
        await delay_1.default(1.2 * 1000);
        return true;
    }
    cycleState() {
        switch (this.state) {
            case 0:
                this.app.setOverrideText("Please grab the monkey");
                break;
            case 1:
                this.app.setOverrideText("Move the monkey then release grab.");
                break;
            case 2:
                this.app.setOverrideText("Please click monkey to turn off grab.");
                break;
            case 3:
                if (this.clickCount % 2 === 0) {
                    this.model.targetingAnimationsByName.get('OnClick').play();
                    this.model.grabbable = false;
                    this.app.setOverrideText("Click to make monkey grabbable again.");
                }
                else {
                    this.model.targetingAnimationsByName.get('OnClick').play();
                    this.model.grabbable = true;
                    this.state = 0;
                    this.cycleState();
                }
                this.clickCount++;
                break;
            default:
                throw new Error(`How did we get here? State: ${this.state}`);
        }
    }
}
exports.default = GrabTest;
//# sourceMappingURL=grab-test.js.map