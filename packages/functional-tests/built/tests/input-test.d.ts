/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class InputTest extends Test {
    expectedResultDescription: string;
    private state;
    private spinCount;
    private model;
    private assets;
    cleanup(): void;
    run(root: MRE.Actor): Promise<boolean>;
    private cycleState;
    private generateSpinData;
    private growAnimationData;
}
