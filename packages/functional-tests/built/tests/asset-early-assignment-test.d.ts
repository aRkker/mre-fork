/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class AssetEarlyAssignmentTest extends Test {
    expectedResultDescription: string;
    private assets;
    run(root: MRE.Actor): Promise<boolean>;
    cleanup(): void;
}
