"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class ButtonBehaviorTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.defaultLabel = "Test the difference between click and hold";
        this.expectedResultDescription = "Button behavior";
    }
    cleanup() {
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        this.createEraseButton();
        // Create scene light
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
        await this.stoppedAsync();
        return true;
    }
    displayString(string) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.buttonLabel.text.contents = string;
        this.timer = setTimeout(() => { this.buttonLabel.text.contents = this.defaultLabel; }, 1000);
    }
    createEraseButton() {
        // Create erase button for the surface
        const buttonMesh = this.assets.createBoxMesh('eraseButton', .5, .5, .01);
        this.testButton = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'testButton',
                transform: { local: { position: { z: -.2, y: .7 } } },
                appearance: { meshId: buttonMesh.id },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        this.buttonLabel = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'testLabel',
                parentId: this.testButton.id,
                transform: { local: { position: { y: .3 } } },
                text: {
                    contents: this.defaultLabel,
                    height: .1,
                    anchor: MRE.TextAnchorLocation.BottomCenter,
                    color: MRE.Color3.Teal()
                }
            }
        });
        const testButtonBehavior = this.testButton.setBehavior(MRE.ButtonBehavior);
        testButtonBehavior.onClick((_, __) => this.displayString("Click Detected!"));
        testButtonBehavior.onButton('holding', () => this.displayString("Hold Detected!"));
    }
}
exports.default = ButtonBehaviorTest;
//# sourceMappingURL=button-behavior-test.js.map