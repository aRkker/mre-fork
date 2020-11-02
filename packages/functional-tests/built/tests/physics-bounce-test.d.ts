/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class PhysicsBounceTest extends Test {
    expectedResultDescription: string;
    private assets;
    private interval;
    private materials;
    private bouncePlane;
    run(root: MRE.Actor): Promise<boolean>;
    cleanup(): void;
    private createBouncePlane;
    private spawnBallOrBox;
}
