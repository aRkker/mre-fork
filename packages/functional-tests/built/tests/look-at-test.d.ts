/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class LookAtTest extends Test {
    expectedResultDescription: string;
    interval: NodeJS.Timeout;
    state: number;
    assets: MRE.AssetContainer;
    cleanup(): void;
    run(root: MRE.Actor): Promise<boolean>;
}
