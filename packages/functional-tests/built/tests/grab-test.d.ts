/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class GrabTest extends Test {
    expectedResultDescription: string;
    private state;
    private clickCount;
    private model;
    private assets;
    private readonly SCALE;
    cleanup(): void;
    run(root: MRE.Actor): Promise<boolean>;
    private cycleState;
    private clickAnimationData;
}
