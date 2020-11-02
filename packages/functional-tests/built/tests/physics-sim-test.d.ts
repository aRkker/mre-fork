/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class PhysicsSimTest extends Test {
    expectedResultDescription: string;
    private assets;
    private interval;
    private defaultPegMat;
    private collisionPegMat;
    private disabledPegMat;
    private ballMat;
    private collRefCount;
    private ballCount;
    private counterPlane;
    run(root: MRE.Actor): Promise<boolean>;
    cleanup(): void;
    private createCounterPlane;
    private createPegField;
    private spawnBall;
}
