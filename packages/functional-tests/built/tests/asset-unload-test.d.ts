/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class AssetUnloadTest extends Test {
    expectedResultDescription: string;
    private assetContainer1;
    private assetContainer2;
    private assetContainer3;
    private prim;
    private state;
    run(root: MRE.Actor): Promise<boolean>;
    cleanup(): void;
    private setup;
    private cycleState;
}
