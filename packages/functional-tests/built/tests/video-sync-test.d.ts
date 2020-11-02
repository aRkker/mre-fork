/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class VideoSyncTest extends Test {
    expectedResultDescription: string;
    private assets;
    cleanup(): void;
    private CreateStreamInstance;
    parentActor: MRE.Actor;
    videoStreams: MRE.VideoStream[];
    currentInstance: MRE.MediaInstance;
    currentStream: number;
    isPlaying: boolean;
    volume: number;
    looping: boolean;
    spread: number;
    rolloffStartDistance: number;
    run(root: MRE.Actor): Promise<boolean>;
    private createControls;
}
