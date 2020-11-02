/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
import { App } from '../app';
import { User } from '@microsoft/mixed-reality-extension-sdk';
export default class PhysicsPileTest extends Test {
    protected app: App;
    protected baseUrl: string;
    protected user: User;
    expectedResultDescription: string;
    private testBounciness;
    private deleteBodiesTimout;
    private boxLimit;
    private boxCounter;
    private forceMagnitude;
    private addForceLikelyhood;
    private assets;
    private b0;
    private b1;
    private redMat;
    private redMatAddForce;
    private blueMat;
    private blueMatAddForce;
    private interval0;
    private interval1;
    constructor(bounciness: number, deleteBodiesTimout: number, boxLimit: number, addForceLikelyhood: number, app: App, baseUrl: string, user: User);
    run(root: MRE.Actor): Promise<boolean>;
    cleanup(): void;
    private createLabel;
    private spawnBox;
}
