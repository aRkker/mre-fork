/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class ActorSpamTest extends Test {
    expectedResultDescription: string;
    protected modsOnly: boolean;
    private assets;
    private spamRoot;
    run(root: MRE.Actor): Promise<boolean>;
    private spawnActors;
}
