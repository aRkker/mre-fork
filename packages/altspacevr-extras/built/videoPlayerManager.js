"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @deprecated
 * This VideoPlayerManager is deprecated and will be removed in the future
 * Instead, please use AssetManager.createVideoStream() and Actor.startVideoStream()
 */
class VideoPlayerManager {
    constructor(context) {
        this.context = context;
        this.videos = new Map();
        this.userJoined = (user) => {
            for (const entry of this.videos) {
                const [actorId, video] = entry;
                this.context.rpc.send({
                    procName: 'VideoPlay',
                    userId: user.id
                }, {
                    parentId: actorId,
                    URL: video.url,
                    startTime: video.basisTime + Date.now() / 1000.0
                });
            }
        };
        this.context.onUserJoined(this.userJoined);
    }
    cleanup() {
        this.context.offUserJoined(this.userJoined);
    }
    play(actorId, url, startTime) {
        if (!this.videos.has(actorId) || this.videos.get(actorId).url !== url) {
            const video = { url, basisTime: startTime - Date.now() / 1000.0 };
            this.videos.set(actorId, video);
            this.context.rpc.send({
                procName: 'VideoPlay'
            }, {
                parentId: actorId,
                URL: url,
                startTime
            });
        }
    }
    stop(actorId) {
        if (this.videos.has(actorId)) {
            this.context.rpc.send({
                procName: 'VideoPlay'
            }, {
                parentId: actorId,
                URL: '', startTime: 0.0
            });
            this.videos.delete(actorId);
        }
    }
}
exports.VideoPlayerManager = VideoPlayerManager;
//# sourceMappingURL=videoPlayerManager.js.map