/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Context, Guid } from '@microsoft/mixed-reality-extension-sdk';
/**
 * @deprecated
 * This VideoPlayerManager is deprecated and will be removed in the future
 * Instead, please use AssetManager.createVideoStream() and Actor.startVideoStream()
 */
export declare class VideoPlayerManager {
    private context;
    private videos;
    constructor(context: Context);
    cleanup(): void;
    private userJoined;
    play(actorId: Guid, url: string, startTime: number): void;
    stop(actorId: Guid): void;
}
//# sourceMappingURL=videoPlayerManager.d.ts.map