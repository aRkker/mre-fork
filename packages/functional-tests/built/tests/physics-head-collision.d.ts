/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
import { App } from '../app';
import { User } from '@microsoft/mixed-reality-extension-sdk';
export default class PhysicsHeadCollisionTest extends Test {
    protected app: App;
    protected baseUrl: string;
    protected user: User;
    private testBounciness;
    private assets;
    private b0;
    private b1;
    private redMat;
    private blueMat;
    constructor(bounciness: number, app: App, baseUrl: string, user: User);
    run(root: MRE.Actor): Promise<boolean>;
    private createLabel;
    private spawnBall;
}
