/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class SoundSyncTest extends Test {
    expectedResultDescription: string;
    private assets;
    cleanup(): void;
    private CreateSoundInstance;
    parentActor: MRE.Actor;
    soundAssets: MRE.Sound[];
    currentInstance: MRE.MediaInstance;
    currentInstanceIndex: number;
    isPlaying: boolean;
    volume: number;
    looping: boolean;
    pitch: number;
    time: number;
    run(root: MRE.Actor): Promise<boolean>;
    private createControls;
}
