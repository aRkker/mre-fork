/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class ButtonTargetingTest extends Test {
    expectedResultDescription: string;
    private drawSurface;
    private eraseButton;
    private surfaceBehavior;
    private assets;
    private drawMesh;
    private hoverMaterial;
    private drawMaterial;
    private drawObjects;
    cleanup(): void;
    run(root: MRE.Actor): Promise<boolean>;
    private spawnTargetObjects;
    private eraseDrawObjects;
    private createDrawSurface;
    private createEraseButton;
}
