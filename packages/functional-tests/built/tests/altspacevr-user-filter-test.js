"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const mixed_reality_extension_altspacevr_extras_1 = require("@microsoft/mixed-reality-extension-altspacevr-extras");
const test_1 = require("../test");
class AltspaceVRUserFilterTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Only moderators can press the button";
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        this.filter = new mixed_reality_extension_altspacevr_extras_1.ModeratorFilter(new mixed_reality_extension_altspacevr_extras_1.SingleEventFilter(this.app.context));
        this.modList = MRE.Actor.Create(this.app.context, { actor: {
                name: "moderatorList",
                parentId: root.id,
                transform: { local: {
                        position: { x: -0.5, y: 1.6, z: -1 }
                    } },
                text: {
                    contents: "Moderators:\n" + this.filter.users.map(u => u.name).join('\n'),
                    anchor: MRE.TextAnchorLocation.TopCenter,
                    height: 0.1
                }
            } });
        this.filter.onUserJoined(() => this.updateModList());
        this.filter.onUserLeft(() => this.updateModList());
        const modMat = this.assets.createMaterial("buttonMat", {
            color: { r: 0.5, b: 0.5, g: 0.5, a: 1 }
        });
        this.modButton = MRE.Actor.Create(this.app.context, { actor: {
                name: "moderatorButton",
                parentId: root.id,
                transform: { local: {
                        position: { x: 0.5, y: 1, z: -1 }
                    } },
                appearance: {
                    meshId: this.assets.createBoxMesh("moderatorButton", 0.2, 0.2, 0.01).id,
                    materialId: modMat.id
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            } });
        this.modButton.setBehavior(MRE.ButtonBehavior)
            .onButton('pressed', this.filter.filterInput(() => modMat.color.set(1, 1, 1, 1)))
            .onButton('released', this.filter.filterInput(() => modMat.color.set(0.5, 0.5, 0.5, 1)));
        await this.stoppedAsync();
        return true;
    }
    updateModList() {
        this.modList.text.contents = "Moderators:\n" + this.filter.users.map(u => u.name).join('\n');
    }
    unload() {
        this.assets.unload();
    }
}
exports.default = AltspaceVRUserFilterTest;
//# sourceMappingURL=altspacevr-user-filter-test.js.map