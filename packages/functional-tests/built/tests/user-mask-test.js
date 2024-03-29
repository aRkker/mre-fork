"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class UserMaskTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Click to change teams";
    }
    cleanup() {
        clearInterval(this.interval);
        this.assets.unload();
    }
    async run(root) {
        // create colors
        this.assets = new MRE.AssetContainer(this.app.context);
        const blue = this.assets.createMaterial('blueMat', {
            color: { r: .102, g: 0.169, b: 0.843 }
        });
        const red = this.assets.createMaterial('redMat', {
            color: { r: .854, g: 0.132, b: 0.132 }
        });
        const not = this.assets.createMaterial('notMat', {
            color: MRE.Color3.Gray()
        });
        const box = this.assets.createBoxMesh('box', 0.5, 0.5, 0.5);
        const sphere = this.assets.createSphereMesh('sphere', 0.3);
        // create team labels
        const textDef = {
            justify: MRE.TextJustify.Center,
            anchor: MRE.TextAnchorLocation.TopCenter,
            height: 0.08
        };
        this.redList = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'redList',
                parentId: root.id,
                transform: { app: { position: { x: -1, y: 1.5 } } },
                appearance: { enabled: true },
                text: textDef
            }
        });
        this.blueList = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'blueList',
                parentId: root.id,
                transform: { app: { position: { x: 1, y: 1.5 } } },
                appearance: { enabled: true },
                text: textDef
            }
        });
        this.updateLabels();
        this.app.context.onUserLeft(() => this.updateLabels());
        // create icons
        const redIcon = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'redIcon',
                parentId: root.id,
                appearance: {
                    enabled: new MRE.GroupMask(this.app.context, ['red', 'default']),
                    meshId: box.id,
                    materialId: red.id
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                transform: {
                    app: { position: { y: 1 } }
                }
            }
        });
        MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'notRedIcon',
                parentId: root.id,
                appearance: {
                    enabled: new MRE.InvertedGroupMask(this.app.context, ['red', 'default']),
                    meshId: box.id,
                    materialId: not.id
                },
                transform: {
                    local: {
                        position: { y: 0.35 },
                        scale: { x: 0.5, y: 0.5, z: 0.5 }
                    }
                }
            }
        });
        const blueIcon = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'blueIcon',
                parentId: root.id,
                appearance: {
                    enabled: new MRE.GroupMask(this.app.context, ['blue', 'default']),
                    meshId: sphere.id,
                    materialId: blue.id
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                transform: {
                    app: { position: { y: 1 } }
                }
            }
        });
        MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'notBlueIcon',
                parentId: root.id,
                appearance: {
                    enabled: new MRE.InvertedGroupMask(this.app.context, ['blue', 'default']),
                    meshId: sphere.id,
                    materialId: not.id
                },
                transform: {
                    local: {
                        position: { y: 0.35 },
                        scale: { x: 0.5, y: 0.5, z: 0.5 }
                    }
                }
            }
        });
        // blink the icons for unaffiliated users
        this.interval = setInterval(() => {
            if (redIcon.appearance.enabledFor.has('default')) {
                redIcon.appearance.enabledFor.delete('default');
                blueIcon.appearance.enabledFor.delete('default');
            }
            else {
                redIcon.appearance.enabledFor.add('default');
                blueIcon.appearance.enabledFor.add('default');
            }
        }, 750);
        // switch team on icon click
        redIcon.setBehavior(MRE.ButtonBehavior).onButton('pressed', user => this.switchTeams(user));
        blueIcon.setBehavior(MRE.ButtonBehavior).onButton('pressed', user => this.switchTeams(user));
        await this.stoppedAsync();
        return true;
    }
    switchTeams(user) {
        if (user.groups.has('red')) {
            user.groups.delete('red');
            user.groups.add('blue');
        }
        else if (user.groups.has('blue')) {
            user.groups.delete('blue');
            user.groups.add('red');
        }
        else {
            user.groups.add(Math.random() >= 0.5 ? 'blue' : 'red');
        }
        this.updateLabels();
    }
    updateLabels() {
        const redList = [];
        const blueList = [];
        for (const user of this.app.context.users) {
            if (user.groups.has('red')) {
                redList.push(user.name);
            }
            else if (user.groups.has('blue')) {
                blueList.push(user.name);
            }
        }
        this.redList.text.contents = `Red team:\n${redList.join('\n')}`;
        this.blueList.text.contents = `Blue team:\n${blueList.join('\n')}`;
    }
}
exports.default = UserMaskTest;
//# sourceMappingURL=user-mask-test.js.map