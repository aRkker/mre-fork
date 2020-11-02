/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Actor, User } from '@microsoft/mixed-reality-extension-sdk';
import { App } from './app';
export declare type TestFactory = (app: App, baseUrl: string, user: User) => Test;
/**
 * The super-class of all functional tests
 */
export declare abstract class Test {
    protected app: App;
    protected baseUrl: string;
    protected user: User;
    /**
     * A human-readable description of what should be happening.
     * Will be displayed as part of the app.
     */
    expectedResultDescription: string;
    protected modsOnly: boolean;
    private _stopped;
    private stoppedPromise;
    private stoppedContinue;
    constructor(app: App, baseUrl: string, user: User);
    /**
     * Main test entry point. This should run indefinitely until [[stop]] is called.
     */
    abstract run(root: Actor): Promise<boolean>;
    /**
     * If the test requires anything other than actor cleanup, do it here.
     */
    cleanup(): void;
    /**
     * Called by the test runner to end the test. Tests should not override this
     * directly, but instead either check the stopped variable, or await stoppedAsync().
     */
    stop(): void;
    /**
     * Synchronous test for when a test should stop
     */
    get stopped(): boolean;
    /**
     * Asynchronous test for when a test should stop
     */
    stoppedAsync(): Promise<void>;
    checkPermission(user: User): void;
}
