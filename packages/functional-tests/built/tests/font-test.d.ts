/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
/**
 * Test the text api functionality
 */
export default class TextTest extends Test {
    expectedResultDescription: string;
    interval: NodeJS.Timeout;
    private assets;
    private textActors;
    private textBlocks;
    private currentList;
    private cycleOptions;
    cleanup(): void;
    createDisplayString(x: any): void;
    run(root: MRE.Actor): Promise<boolean>;
    private createTemplate;
    private createControls;
}
