"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const app_1 = require("./app");
const tests_1 = require("./tests");
const destroyActors_1 = tslib_1.__importDefault(require("./utils/destroyActors"));
const paginate_1 = require("./utils/paginate");
const pageSize = 6;
const buttonSpacing = 2 / (pageSize + 1);
const buttonWidth = 0.25;
const buttonHeight = buttonSpacing * 0.8;
const MenuItems = paginate_1.paginate(tests_1.Factories, pageSize);
class Menu {
    constructor(app) {
        this.app = app;
        this.breadcrumbs = [];
    }
    get context() { return this.app.context; }
    onSelection(handler) {
        this.handler = handler;
    }
    hide() {
        this.destroy();
    }
    back() {
        this.breadcrumbs.pop();
    }
    show() {
        if (!this.buttons) {
            this.setup();
        }
        const menu = !this.breadcrumbs.length ?
            MenuItems :
            this.breadcrumbs.reduce((submenu, choice) => submenu[choice].action, MenuItems);
        this.behaviors.forEach((behavior, i) => {
            let handler;
            let label;
            let buttonMat;
            if (!menu[i]) {
                label = "";
                handler = null;
                buttonMat = null;
            }
            else if (typeof menu[i].action === 'function') {
                label = menu[i].label;
                handler = user => {
                    if (this.handler) {
                        this.handler(menu[i].label, menu[i].action, user);
                    }
                };
                buttonMat = this.app.testResults[label] === true ? this.successMat :
                    this.app.testResults[label] === false ? this.failureMat : this.neutralMat;
            }
            else {
                label = menu[i].label;
                handler = () => {
                    this.breadcrumbs.push(i);
                    this.show();
                };
                const allTestsPass = menu[i].action
                    .reduce((sum, test, j, arr) => {
                    if (Array.isArray(test.action)) {
                        arr.push(...test.action);
                    }
                    else {
                        return sum && this.app.testResults[test.label] === true;
                    }
                }, true);
                const anyTestFails = menu[i].action
                    .reduce((sum, test, j, arr) => {
                    if (Array.isArray(test.action)) {
                        arr.push(...test.action);
                    }
                    else {
                        return sum || this.app.testResults[test.label] === false;
                    }
                }, false);
                buttonMat = allTestsPass ? this.successMat : (anyTestFails ? this.failureMat : null);
            }
            this.buttons[i].appearance.material = buttonMat;
            this.labels[i].text.contents = label;
            behavior.onButton('released', handler);
        });
        // hide back button on root menu
        if (this.breadcrumbs.length === 0) {
            for (const a of this.backActors) {
                a.appearance.enabled = false;
                if (a.text) {
                    a.text.enabled = false;
                }
            }
        }
        else {
            for (const a of this.backActors) {
                a.appearance.enabled = true;
                if (a.text) {
                    a.text.enabled = true;
                }
            }
        }
    }
    setup() {
        if (!this.successMat) {
            const am = this.app.assets;
            this.successMat = am.createMaterial('success', { color: app_1.SuccessColor });
            this.failureMat = am.createMaterial('failure', { color: app_1.FailureColor });
            this.neutralMat = am.createMaterial('neutral', { color: app_1.NeutralColor });
            this.buttonMesh = am.createBoxMesh('button', buttonWidth, buttonHeight, 0.1);
        }
        if (this.buttons) {
            this.destroy();
        }
        this.buttons = [];
        this.behaviors = [];
        this.labels = [];
        for (let i = 0; i < pageSize; i++) {
            const control = MRE.Actor.Create(this.context, {
                actor: {
                    name: 'Button' + i,
                    appearance: {
                        meshId: this.buttonMesh.id,
                        materialId: this.neutralMat.id
                    },
                    transform: {
                        local: {
                            position: {
                                x: -1 + buttonWidth / 2,
                                y: buttonSpacing / 2 + buttonSpacing * (pageSize - i),
                                z: -0.05
                            }
                        }
                    },
                    collider: { geometry: { shape: MRE.ColliderType.Auto } }
                }
            });
            this.behaviors.push(control.setBehavior(MRE.ButtonBehavior));
            this.buttons.push(control);
            const label = MRE.Actor.Create(this.context, {
                actor: {
                    name: 'Label' + i,
                    parentId: control.id,
                    transform: {
                        local: {
                            position: { x: buttonWidth * 0.8, z: 0.05 }
                        },
                    },
                    text: {
                        contents: "Placeholder",
                        height: 0.2,
                        anchor: MRE.TextAnchorLocation.MiddleLeft
                    }
                }
            });
            this.labels.push(label);
        }
        const backButton = MRE.Actor.Create(this.context, {
            actor: {
                name: 'BackButton',
                appearance: {
                    meshId: this.buttonMesh.id
                },
                transform: {
                    local: {
                        position: { x: -1 + buttonWidth / 2, y: buttonSpacing / 2, z: -0.05 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        const backLabel = MRE.Actor.Create(this.context, {
            actor: {
                name: 'BackLabel',
                parentId: backButton.id,
                transform: {
                    local: {
                        position: { x: buttonWidth * 0.8, z: 0.05 }
                    },
                },
                text: {
                    contents: "Back",
                    height: 0.2,
                    anchor: MRE.TextAnchorLocation.MiddleLeft
                }
            }
        });
        backButton.setBehavior(MRE.ButtonBehavior)
            .onButton('released', () => {
            this.back();
            this.show();
        });
        this.backActors = [backButton, backLabel];
    }
    destroy() {
        destroyActors_1.default(this.buttons);
        destroyActors_1.default(this.backActors);
        this.buttons = null;
        this.behaviors = null;
        this.labels = null;
        this.backActors = null;
    }
}
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map