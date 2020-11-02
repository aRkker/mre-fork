/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class ClockSyncTest extends Test {
    expectedResultDescription: string;
    private assets;
    cleanup(): void;
    run(root: MRE.Actor): Promise<boolean>;
    createAnimatableDigit(name: string, digits: string, parentId: MRE.Guid): MRE.Actor;
    buildDigitAnimation(mesh: MRE.Actor, xOffset: number, yOffset: number, secondsPerStep: number, digits: number, frameCount: number, lineHeight: number, scale: number): void;
}
