"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appearance = void 0;
const __1 = require("..");
class Appearance {
    constructor(actor) {
        this.actor = actor;
        /** @hidden */
        this.$DoNotObserve = ['actor', '_enabledFor'];
        this._enabled = __1.GroupMask.ALL_PACKED; // authoritative
        this._materialId = __1.ZeroGuid;
        this._meshId = __1.ZeroGuid;
    }
    /**
     * This actor's visibility preference, independent of its parent. See [[Appearance.activeAndEnabled]] for
     * the computed visibility state. If this property is a GroupMask object, this property will
     * effectively be `true` for users in at least one of the groups, and `false` for everyone else.
     * See [[GroupMask]].
     */
    get enabled() {
        if (this.enabledPacked === __1.GroupMask.ALL_PACKED) {
            return true;
        }
        else if (this.enabledPacked === __1.GroupMask.NONE_PACKED) {
            return false;
        }
        else {
            return this.enabledFor;
        }
    }
    set enabled(value) {
        if (value === true) {
            this.enabledPacked = __1.GroupMask.ALL_PACKED;
        }
        else if (value === false) {
            this.enabledPacked = __1.GroupMask.NONE_PACKED;
        }
        else if (typeof value === 'number') {
            this.enabledPacked = value;
        }
        else {
            this.enabledFor = value;
        }
    }
    /**
     * [[enabled]], but forced to a [[GroupMask]]. Using this property will convert this
     * actor's `enabled` property to the GroupMask equivalent of its current value relative
     * to the current set of used groups.
     */
    get enabledFor() {
        if (!this._enabledFor) {
            this._enabledFor = __1.GroupMask.FromPacked(this.actor.context, this._enabled);
            this._enabledFor.onChanged(gm => this._enabled = gm.packed());
        }
        return this._enabledFor;
    }
    set enabledFor(value) {
        if (!value) {
            this.enabled = false;
            return;
        }
        this.enabledPacked = value.packed();
        this._enabledFor = value.getClean();
        this._enabledFor.onChanged(gm => this._enabled = gm.packed());
    }
    get enabledPacked() { return this._enabled; }
    set enabledPacked(value) {
        this._enabled = value;
        if (this._enabledFor) {
            this._enabledFor.setPacked(value);
        }
    }
    /** Whether this actor is visible */
    get activeAndEnabled() {
        return (!this.actor.parent || this.actor.parent.appearance.activeAndEnabled)
            && this._enabled !== __1.GroupMask.NONE_PACKED;
    }
    /** @returns A shared reference to this actor's material, or null if this actor has no material */
    get material() {
        var _a;
        return (_a = this.actor.context.internal.lookupAsset(this._materialId)) === null || _a === void 0 ? void 0 : _a.material;
    }
    set material(value) {
        var _a;
        this.materialId = (_a = value === null || value === void 0 ? void 0 : value.id) !== null && _a !== void 0 ? _a : __1.ZeroGuid;
    }
    /** @inheritdoc */
    get materialId() { return this._materialId; }
    set materialId(value) {
        if (!value) {
            value = __1.ZeroGuid;
        }
        if (!this.actor.context.internal.lookupAsset(value)) {
            value = __1.ZeroGuid; // throw?
        }
        if (value === this._materialId) {
            return;
        }
        if (this.material) {
            this.material.clearReference(this.actor);
        }
        this._materialId = value;
        if (this.material) {
            this.material.addReference(this.actor);
        }
    }
    /** @returns A shared reference to this actor's mesh, or null if this actor has no mesh */
    get mesh() {
        var _a;
        return (_a = this.actor.context.internal.lookupAsset(this._meshId)) === null || _a === void 0 ? void 0 : _a.mesh;
    }
    set mesh(value) {
        var _a;
        this.meshId = (_a = value === null || value === void 0 ? void 0 : value.id) !== null && _a !== void 0 ? _a : __1.ZeroGuid;
    }
    /** @inheritdoc */
    get meshId() { return this._meshId; }
    set meshId(value) {
        if (!value) {
            value = __1.ZeroGuid;
        }
        if (!this.actor.context.internal.lookupAsset(value)) {
            value = __1.ZeroGuid; // throw?
        }
        if (value === this._meshId) {
            return;
        }
        if (this.mesh) {
            this.mesh.clearReference(this.actor);
        }
        this._meshId = value;
        if (this.mesh) {
            this.mesh.addReference(this.actor);
        }
    }
    copy(from) {
        if (!from) {
            return this;
        }
        if (from.materialId !== undefined) {
            this.materialId = from.materialId;
        }
        if (from.meshId !== undefined) {
            this.meshId = from.meshId;
        }
        if (typeof from.enabled === 'number') {
            // redirect masks that got into the enabled field
            this.enabledPacked = from.enabled;
        }
        else if (from.enabled !== undefined) {
            this.enabled = from.enabled;
        }
        return this;
    }
    toJSON() {
        return {
            enabled: this.enabledPacked,
            materialId: this.materialId,
            meshId: this.meshId
        };
    }
    /**
     * Prepare outgoing messages
     * @hidden
     */
    static sanitize(msg) {
        // Need to reduce `boolean | GroupMask | number` to just `number`.
        // GroupMask is already serialized to number, so just need to handle boolean case.
        if (msg.enabled === true) {
            msg.enabled = __1.GroupMask.ALL_PACKED;
        }
        else if (msg.enabled === false) {
            msg.enabled = __1.GroupMask.NONE_PACKED;
        }
        return msg;
    }
}
exports.Appearance = Appearance;
//# sourceMappingURL=appearance.js.map