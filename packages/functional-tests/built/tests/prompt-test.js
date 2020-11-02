"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class PromptTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Display a text prompt to a user";
    }
    async run(root) {
        let success = true;
        const noTextButton = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'noTextButton',
                parentId: root.id,
                transform: { local: { position: { x: -1, y: 1, z: -1 } } },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } },
                text: {
                    contents: "Click for message",
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    justify: MRE.TextJustify.Center
                }
            }
        });
        noTextButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
            user.prompt(`Hello ${user.name}!`)
                .then(res => {
                noTextButton.text.contents =
                    `Click for message\nLast response: ${res.submitted ? "<ok>" : "<cancelled>"}`;
            })
                .catch(err => {
                console.error(err);
                success = false;
                this.stop();
            });
        });
        const textButton = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'textButton',
                parentId: root.id,
                transform: { local: { position: { x: 1, y: 1, z: -1 } } },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } },
                text: {
                    contents: "Click for prompt",
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    justify: MRE.TextJustify.Center
                }
            }
        });
        textButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
            user.prompt("Who's your favorite musician?", true)
                .then(res => {
                textButton.text.contents =
                    `Click for prompt\nLast response: ${res.submitted ? res.text : "<cancelled>"}`;
            })
                .catch(err => {
                console.error(err);
                success = false;
                this.stop();
            });
        });
        await this.stoppedAsync();
        return success;
    }
}
exports.default = PromptTest;
//# sourceMappingURL=prompt-test.js.map