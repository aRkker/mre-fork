/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { App } from '../app';
import { Test } from '../test';
export default class AltspaceVRVideoTest extends Test {
    expectedResultDescription: string;
    protected modsOnly: boolean;
    private videoPlayerManager;
    private assets;
    constructor(app: App, baseUrl: string, user: MRE.User);
    cleanup(): void;
    private _state;
    run(root: MRE.Actor): Promise<boolean>;
}
