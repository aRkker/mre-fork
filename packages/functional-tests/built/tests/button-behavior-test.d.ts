/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class ButtonBehaviorTest extends Test {
    private defaultLabel;
    expectedResultDescription: string;
    private testButton;
    private testBehavior;
    private buttonLabel;
    private assets;
    private timer;
    cleanup(): void;
    run(root: MRE.Actor): Promise<boolean>;
    private displayString;
    private createEraseButton;
}
