/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class PhysicsFrictionTest extends Test {
    expectedResultDescription: string;
    private assets;
    private interval;
    private materials;
    private slopePlane;
    run(root: MRE.Actor): Promise<boolean>;
    cleanup(): void;
    private createSlopePlane;
    private spawnBox;
}
