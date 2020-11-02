"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The super-class of all functional tests
 */
class Test {
    constructor(app, baseUrl, user) {
        this.app = app;
        this.baseUrl = baseUrl;
        this.user = user;
        this.modsOnly = false;
        this._stopped = false;
        this.stoppedPromise = null;
        this.stoppedContinue = null;
    }
    /**
     * If the test requires anything other than actor cleanup, do it here.
     */
    cleanup() { }
    /**
     * Called by the test runner to end the test. Tests should not override this
     * directly, but instead either check the stopped variable, or await stoppedAsync().
     */
    stop() {
        this._stopped = true;
        if (this.stoppedContinue) {
            this.stoppedContinue();
            this.stoppedContinue = null;
        }
    }
    /**
     * Synchronous test for when a test should stop
     */
    get stopped() { return this._stopped; }
    /**
     * Asynchronous test for when a test should stop
     */
    stoppedAsync() {
        return this.stoppedPromise = this.stoppedPromise ||
            new Promise(resolve => {
                if (this._stopped) {
                    resolve();
                }
                else {
                    this.stoppedContinue = resolve;
                }
            });
    }
    checkPermission(user) {
        if (this.modsOnly) {
            if (user.properties['altspacevr-roles'] !== undefined
                && !/moderator|presenter/u.test(user.properties['altspacevr-roles'])) {
                throw new Error('Only moderators can run this test');
            }
            else {
                console.log(`User ${user.name} allowed to start test`);
            }
        }
    }
}
exports.Test = Test;
//# sourceMappingURL=test.js.map