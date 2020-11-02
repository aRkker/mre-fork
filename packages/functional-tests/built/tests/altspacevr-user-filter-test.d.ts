/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class AltspaceVRUserFilterTest extends Test {
    expectedResultDescription: string;
    private assets;
    private filter;
    private modList;
    private modButton;
    run(root: MRE.Actor): Promise<boolean>;
    private updateModList;
    unload(): void;
}
