/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class PhysicsFreeFallTest extends Test {
    expectedResultDescription: string;
    private assets;
    private redMat;
    private blueMat;
    run(root: MRE.Actor): Promise<boolean>;
    private createLabel;
    private spawnBall;
}
