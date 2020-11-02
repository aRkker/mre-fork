"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
const mixed_reality_extension_altspacevr_extras_1 = require("@microsoft/mixed-reality-extension-altspacevr-extras");
class AltspaceVRVideoTest extends test_1.Test {
    constructor(app, baseUrl, user) {
        super(app, baseUrl, user);
        this.expectedResultDescription = "Play a couple youtube videos. Click to cycle.";
        this.modsOnly = true;
        this._state = 0;
        this.videoPlayerManager = new mixed_reality_extension_altspacevr_extras_1.VideoPlayerManager(app.context);
        this.assets = new MRE.AssetContainer(this.app.context);
    }
    cleanup() {
        this.videoPlayerManager.cleanup();
        this.assets.unload();
    }
    async run(root) {
        const video = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                name: 'video',
                transform: {
                    local: {
                        position: { x: 0, y: 1, z: 0 },
                        scale: { x: 2, y: 2, z: 2 }
                    }
                },
            }
        });
        const cycleState = () => {
            if (this._state === 0) {
                this.app.setOverrideText("Playing Movie!");
                this.videoPlayerManager.play(video.id, 'https://www.youtube.com/watch?v=z1YNh9BQVRg', 0.0);
            }
            else if (this._state === 1) {
                this.app.setOverrideText("Switched Movie!");
                this.videoPlayerManager.play(video.id, 'https://www.youtube.com/watch?v=UowkIRSDHfs', 0.0);
            }
            else if (this._state === 2) {
                this.app.setOverrideText("Stopped Movie!");
                this.videoPlayerManager.stop(video.id);
            }
            this._state = (this._state + 1) % 3;
        };
        cycleState();
        const button = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'Button',
                parentId: root.id,
                appearance: {
                    meshId: this.assets.createSphereMesh('spherebutton', 0.2).id
                },
                transform: {
                    local: {
                        position: { x: -0.8, y: 0.2, z: 0 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        const buttonBehavior = button.setBehavior(MRE.ButtonBehavior);
        buttonBehavior.onButton('released', cycleState);
        await this.stoppedAsync();
        return true;
    }
}
exports.default = AltspaceVRVideoTest;
//# sourceMappingURL=altspacevr-video-test.js.map