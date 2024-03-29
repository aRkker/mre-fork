"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaInstance = void 0;
const __1 = require("../..");
/**
 * A MediaInstance represents an instance managing the playback of a sound or video stream,
 * i.e. it plays an asset that was preloaded in an asset container
 */
class MediaInstance {
    constructor(actor, mediaAssetId) {
        this.id = __1.newGuid();
        this.actor = actor;
        this.mediaAssetId = mediaAssetId;
    }
    /**
     * @hidden
     */
    start(options) {
        // this.actor.context.internal.lookupAsset(this.mediaAssetId).created.then(() => {
        // 	this.actor.context.internal.setMediaState(
        // 		this, MediaCommand.Start, options, this.mediaAssetId);
        // }).catch(reason => {
        // 	log.error('app', `Start failed ${this.actor.id}. ${(reason || '').toString()}`.trim());
        // });
        try {
            this.actor.context.internal.setMediaState(this, __1.MediaCommand.Start, options, this.mediaAssetId);
            return this;
        }
        catch (reason) {
            __1.log.error('app', `Start failed ${this.actor.id}. ${(reason || '').toString()}`.trim());
        }
    }
    /**
     * Updates the state of the active media
     * @param options Adjustments to pitch and volume, and other characteristics.
     */
    setState(options) {
        // this.actor.context.internal.lookupAsset(this.mediaAssetId).created.then(() => {
        // 	this.actor.context.internal.setMediaState(this, MediaCommand.Update, options);
        // }).catch((reason: any) => {
        // 	log.error('app', `SetState failed ${this.actor.id}. ${(reason || '').toString()}`.trim());
        // });
        try {
            this.actor.context.internal.setMediaState(this, __1.MediaCommand.Update, options);
        }
        catch (reason) {
            __1.log.error('app', `SetState failed ${this.actor.id}. ${(reason || '').toString()}`.trim());
        }
    }
    /**
     * Pause the media playback
     */
    pause() {
        this.setState({ paused: true });
    }
    /**
     * Unpause the media playback
     */
    resume() {
        this.setState({ paused: false });
    }
    /**
     * Finish the media playback and destroy the instance.
     */
    stop() {
        try {
            // this.actor.context.internal.lookupAsset(this.mediaAssetId).created.then(() => {
            this.actor.context.internal.setMediaState(this, __1.MediaCommand.Stop);
            // }).catch((reason: any) => {
        }
        catch (reason) {
            __1.log.error('app', `Stop failed ${this.actor.id}. ${(reason || '').toString()}`.trim());
            // });
        }
    }
}
exports.MediaInstance = MediaInstance;
//# sourceMappingURL=mediaInstance.js.map