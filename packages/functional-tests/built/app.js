"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const menu_1 = require("./menu");
const tests_1 = require("./tests");
const destroyActors_1 = tslib_1.__importDefault(require("./utils/destroyActors"));
exports.SuccessColor = MRE.Color3.Green();
exports.FailureColor = MRE.Color3.Red();
exports.NeutralColor = MRE.Color3.Yellow();
exports.BackgroundColor = new MRE.Color3(0.25, 0.25, 0.25);
/**
 * Functional Test Application. Takes query arguments to the websocket connection
 * @param test - Initialize menu on a particular test
 * @param autostart - Start the test immediately on user join
 * @param nomenu - Do not spawn the controls
 */
class App {
    constructor(_context, params, baseUrl) {
        this._context = _context;
        this.params = params;
        this.baseUrl = baseUrl;
        this._connectedUsers = new Map();
        this.testResults = {};
        this.activeTest = null;
        this.runPromise = null;
        this.menu = new menu_1.Menu(this);
        this.assets = new MRE.AssetContainer(_context);
        this.context.onStarted(() => {
            this.setupShared();
            if (this.params.test === undefined) {
                this.menu.show();
            }
            else {
                this.activeTestName = this.params.test;
                this.activeTestFactory = tests_1.Factories[this.activeTestName];
                this.setupRunner();
            }
        });
        this.context.onUserJoined((user) => this.userJoined(user));
        this.context.onUserLeft((user) => this.userLeft(user));
        this.backgroundMaterial = this.assets.createMaterial('background', {
            color: exports.BackgroundColor
        });
        this.menu.onSelection((name, factory, user) => {
            this.menu.hide();
            this.activeTestName = name;
            this.activeTestFactory = factory;
            this.runTest(user);
        });
    }
    get context() { return this._context; }
    get connectedUsers() { return this._connectedUsers; }
    userJoined(user) {
        this.connectedUsers.set(user.id, user);
        if (!this.firstUser) {
            this.firstUser = user;
            if (this.params.autorun === 'true' || this.params.nomenu === 'true') {
                this.runTest(user);
            }
        }
    }
    userLeft(user) {
        this.connectedUsers.delete(user.id);
        if (user === this.firstUser) {
            this.firstUser = this.context.users[0] || null;
            if (!this.firstUser) {
                this.stopTest().catch(() => { });
            }
        }
    }
    runTest(user) {
        // finish setting up runner
        if (!this.contextLabel) {
            this.setupRunner();
        }
        // halt the previous test if there is one
        (this.activeTest !== null ? this.stopTest() : Promise.resolve())
            // start the new test, and save the stop handle
            .then(() => {
            if (this.playPauseButton) {
                this.playPauseButton.appearance.material.color.set(1, 0, 0, 1);
                this.playPauseText.text.contents = "Stop";
            }
            return this.runPromise = this.runTestHelper(user);
        })
            // and log unexpected errors
            .catch(err => console.log(err));
    }
    async runTestHelper(user) {
        this.context.rpc.send({ procName: 'functional-test:test-starting' }, this.activeTestName);
        console.log(`Test starting: '${this.activeTestName}'`);
        const test = this.activeTest = this.activeTestFactory(this, this.baseUrl, user);
        this.setOverrideText(test.expectedResultDescription);
        this.testRoot = MRE.Actor.Create(this.context, {
            actor: {
                name: 'testRoot',
                exclusiveToUser: this.exclusiveUser && this.exclusiveUser.id || undefined
            }
        });
        let success;
        try {
            test.checkPermission(user);
            success = await test.run(this.testRoot);
            if (!success) {
                this.setOverrideText("Test Failed: '${testName}'", exports.FailureColor);
            }
        }
        catch (e) {
            console.log(e);
            this.setOverrideText(e.toString(), exports.FailureColor);
            success = false;
        }
        console.log(`Test complete: '${this.activeTestName}'. Success: ${success}`);
        this.context.rpc.send({ procName: 'functional-test:test-complete' }, this.activeTestName, success);
        this.testResults[this.activeTestName] = success;
        if (success) {
            this.setOverrideText(null);
        }
    }
    async stopTest() {
        var _a;
        if (this.activeTest !== null) {
            this.activeTest.stop();
            await this.runPromise;
            this.activeTest.cleanup();
            this.activeTest = null;
            this.runPromise = null;
            // Delete all actors
            (_a = this.testRoot) === null || _a === void 0 ? void 0 : _a.destroy();
            this.testRoot = null;
            if (this.playPauseButton) {
                this.playPauseButton.appearance.material.color.set(0, 1, 0, 1);
                this.playPauseText.text.contents = "Start";
            }
        }
    }
    setOverrideText(text, color = exports.NeutralColor) {
        if (text) {
            this.contextLabel.text.color = color;
            this.contextLabel.text.contents = text;
        }
        else {
            if (this.testResults[this.activeTestName] === true) {
                this.contextLabel.text.color = exports.SuccessColor;
            }
            else if (this.testResults[this.activeTestName] === false) {
                this.contextLabel.text.color = exports.FailureColor;
            }
            else {
                this.contextLabel.text.color = exports.NeutralColor;
            }
            this.contextLabel.text.contents = this.activeTest.expectedResultDescription;
        }
    }
    async toggleExclusiveUser(user) {
        if (this.exclusiveUser || !user) {
            this.exclusiveUser = null;
            this.exclusiveUserLabel.contents = "Inclusive";
        }
        else {
            this.exclusiveUser = user;
            this.exclusiveUserLabel.contents = `Exclusive to:\n${user.name}`;
        }
        const wasRunning = !!this.activeTest;
        await this.stopTest();
        if (wasRunning) {
            this.runTest(user);
        }
    }
    setupShared() {
        // change the exclusive user
        if (this.params.exclusive) {
            this.exclusiveUser = this.firstUser;
        }
        this.exclusiveUserToggle = MRE.Actor.Create(this.context, {
            actor: {
                appearance: {
                    meshId: this.assets.createBoxMesh('button', 0.25, 0.25, 0.1).id
                },
                transform: {
                    local: {
                        position: { x: -0.875, y: 2.3 }
                    }
                },
                collider: {
                    geometry: { shape: MRE.ColliderType.Auto }
                }
            }
        });
        const label = MRE.Actor.Create(this.context, {
            actor: {
                parentId: this.exclusiveUserToggle.id,
                transform: {
                    local: {
                        position: { x: 0.3 }
                    }
                },
                text: {
                    contents: this.exclusiveUser ? `Exclusive to:\n${this.exclusiveUser.name}` : "Inclusive",
                    height: 0.2,
                    anchor: MRE.TextAnchorLocation.MiddleLeft
                }
            }
        });
        this.exclusiveUserLabel = label.text;
        this.exclusiveUserToggle.setBehavior(MRE.ButtonBehavior)
            .onButton('released', user => this.toggleExclusiveUser(user));
        MRE.Actor.Create(this.context, {
            actor: {
                name: 'floor',
                appearance: {
                    meshId: this.assets.createBoxMesh('floor', 2, 0.1, 2.1).id,
                    materialId: this.backgroundMaterial.id
                },
                transform: {
                    local: {
                        position: { x: 0, y: -0.05, z: -1 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        MRE.Actor.Create(this.context, {
            actor: {
                name: 'wall',
                appearance: {
                    meshId: this.assets.createBoxMesh('wall', 2, 2, 0.1).id,
                    materialId: this.backgroundMaterial.id
                },
                transform: {
                    local: {
                        position: { x: 0, y: 1, z: 0.1 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
    }
    setupRunner() {
        // Main label at the top of the stage
        this.contextLabel = MRE.Actor.Create(this.context, {
            actor: {
                name: 'contextLabel',
                text: {
                    contents: this.activeTestName,
                    height: 0.2,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    justify: MRE.TextJustify.Center,
                    color: exports.NeutralColor
                },
                transform: {
                    local: {
                        position: { y: 1.8 }
                    }
                }
            }
        });
        if (this.params.nomenu === 'true') {
            this.runnerActors = [this.contextLabel];
            return;
        }
        // start or stop the active test
        const ppMat = this.assets.materials.find(m => m.name === 'ppMat') ||
            this.assets.createMaterial('ppMat', { color: MRE.Color3.Green() });
        const ppMesh = this.assets.materials.find(m => m.name === 'ppMesh') ||
            this.assets.createBoxMesh('ppMesh', 0.7, 0.3, 0.1);
        this.playPauseButton = MRE.Actor.Create(this.context, {
            actor: {
                name: 'playpause',
                appearance: {
                    meshId: ppMesh.id,
                    materialId: ppMat.id
                },
                transform: {
                    local: {
                        position: { x: -0.65, y: 0.15, z: -1.95 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        this.playPauseText = MRE.Actor.Create(this.context, {
            actor: {
                parentId: this.playPauseButton.id,
                transform: {
                    local: {
                        position: { z: -0.1 }
                    }
                },
                text: {
                    contents: "Start",
                    height: 0.15,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    justify: MRE.TextJustify.Center,
                    color: exports.NeutralColor
                }
            }
        });
        this.playPauseButton.setBehavior(MRE.ButtonBehavior)
            .onButton("released", user => {
            if (this.activeTest === null) {
                this.runTest(user);
            }
            else {
                this.stopTest().catch(err => MRE.log.error('app', err));
            }
        });
        const menuButton = MRE.Actor.Create(this.context, {
            actor: {
                name: 'menu',
                appearance: {
                    meshId: ppMesh.id
                },
                transform: {
                    local: {
                        position: { x: 0.65, y: 0.15, z: -1.95 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        const menuText = MRE.Actor.Create(this.context, {
            actor: {
                parentId: menuButton.id,
                transform: {
                    local: {
                        position: { z: -0.1 }
                    }
                },
                text: {
                    contents: "Return",
                    height: 0.15,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    justify: MRE.TextJustify.Center,
                    color: MRE.Color3.Black()
                }
            }
        });
        menuButton.setBehavior(MRE.ButtonBehavior)
            .onButton("released", async () => {
            await this.stopTest();
            [this.contextLabel, this.playPauseButton, this.playPauseText]
                = this.runnerActors
                    = destroyActors_1.default(this.runnerActors);
            this.menu.show();
        });
        this.runnerActors = [
            this.contextLabel, this.testRoot, this.playPauseButton,
            this.playPauseText, menuButton, menuText
        ];
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map