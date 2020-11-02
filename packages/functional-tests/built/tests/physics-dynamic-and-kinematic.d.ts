/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { App } from '../app';
import { Test } from '../test';
export default class PhysicsDynamicVsKinematicTest extends Test {
    protected app: App;
    protected baseUrl: string;
    protected user: MRE.User;
    expectedResultDescription: string;
    private assets;
    private interval;
    private dynamic;
    private kinematic;
    private boxMeshId;
    private numBoxes;
    constructor(app: App, baseUrl: string, user: MRE.User);
    run(root: MRE.Actor): Promise<boolean>;
    cleanup(): void;
    private spawnBall;
}
