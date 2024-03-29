"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor = void 0;
const events_1 = __importDefault(require("events"));
const __1 = require("..");
const internal_1 = require("../internal");
const actorInternal_1 = require("./actorInternal");
/**
 * An actor represents an object instantiated on the host.
 */
class Actor {
    constructor(_context, _id) {
        this._context = _context;
        this._id = _id;
        this._internal = new actorInternal_1.ActorInternal(this);
        this._emitter = new events_1.default.EventEmitter();
        this._parentId = __1.ZeroGuid;
        this._subscriptions = [];
        this._transform = new __1.ActorTransform();
        this._appearance = new __1.Appearance(this);
        this._grabbable = false;
        /** @hidden */
        this.actorChanged = (...path) => {
            if (this.internal.observing) {
                this.internal.patch = this.internal.patch || {};
                internal_1.readPath(this, this.internal.patch, ...path);
                this.context.internal.incrementGeneration();
            }
        };
        // Actor patching: Observe the transform for changed values.
        internal_1.observe({
            target: this._transform,
            targetName: 'transform',
            notifyChanged: (...path) => this.actorChanged(...path)
        });
        // Observe changes to the looks of this actor
        internal_1.observe({
            target: this._appearance,
            targetName: 'appearance',
            notifyChanged: (...path) => this.actorChanged(...path)
        });
    }
    /** @hidden */
    get internal() { return this._internal; }
    /** @hidden */
    get emitter() { return this._emitter; }
    get grab() { this._grab = this._grab || new __1.DiscreteAction(); return this._grab; }
    /*
     * PUBLIC ACCESSORS
     */
    get context() { return this._context; }
    get id() { return this._id; }
    get name() { return this._name; }
    get tag() { return this._tag; }
    set tag(value) { this._tag = value; this.actorChanged('tag'); }
    /** @inheritdoc */
    get exclusiveToUser() { return this._exclusiveToUser; }
    get owner() { return this._owner; }
    set owner(value) { this._owner = value; this.actorChanged('owner'); }
    get subscriptions() { return this._subscriptions; }
    get transform() { return this._transform; }
    set transform(value) { this._transform.copy(value); }
    get appearance() { return this._appearance; }
    set appearance(value) { this._appearance.copy(value); }
    get light() { return this._light; }
    get rigidBody() { return this._rigidBody; }
    get collider() { return this._collider; }
    get text() { return this._text; }
    get attachment() { return this._attachment; }
    get lookAt() { return this._lookAt; }
    get children() { return this.context.actors.filter(actor => actor.parentId === this.id); }
    get parent() { return this._context.actor(this._parentId); }
    set parent(value) { this.parentId = value && value.id || __1.ZeroGuid; }
    get parentId() { return this._parentId; }
    set parentId(value) {
        const parentActor = this.context.actor(value);
        if (!value || !parentActor) {
            value = __1.ZeroGuid;
        }
        if (parentActor && parentActor.exclusiveToUser && parentActor.exclusiveToUser !== this.exclusiveToUser) {
            throw new Error(`User-exclusive actor ${this.id} can only be parented to inclusive actors ` +
                "and actors that are exclusive to the same user.");
        }
        if (this._parentId !== value) {
            this._parentId = value;
            this.actorChanged('parentId');
        }
    }
    get grabbable() { return this._grabbable; }
    set grabbable(value) {
        if (value !== this._grabbable) {
            this._grabbable = value;
            this.actorChanged('grabbable');
        }
    }
    /**
     * @hidden
     * TODO - get rid of this.
     */
    static alloc(context, id) {
        return new Actor(context, id);
    }
    /**
     * PUBLIC METHODS
     */
    /**
    * Destroys the collider.
    */
    clearCollider() {
        if (this._collider) {
            internal_1.unobserve(this._collider);
            this._collider = null;
        }
    }
    /**
     * Creates a new, empty actor without geometry.
     * @param context The SDK context object.
     * @param options.actor The initial state of the actor.
     */
    static Create(context, options) {
        return context.internal.Create(options);
    }
    /**
     * @deprecated
     * Use [[Actor.Create]] instead.
     */
    static CreateEmpty(context, options) {
        return Actor.Create(context, options);
    }
    /**
     * Creates a new actor from a library resource, which is host-dependent.
     * For AltspaceVR, the available resource ID formats are:
     * * `teleporter:event/<event_id>[?label=true]`, with an Altspace event ID, which you can get from the URL of an
     *     event's page on https://account.altvr.com.
     * * `teleporter:space/<space_id>[?label=true]`
     * * `teleporter:<event_or_space_id>[?label=true]`
     * * `artifact:<artifact_id>`, with an Altspace artifact ID from https://account.altvr.com/kits.
     * @param context The SDK context object.
     * @param options.resourceId The id of the library resource to instantiate.
     * @param options.actor The initial state of the root actor.
     */
    static CreateFromLibrary(context, options) {
        return context.internal.CreateFromLibrary(options);
    }
    static CreateFromPrefab(context, options) {
        let prefabId = options.prefabId;
        if (!prefabId && options.prefab) {
            prefabId = options.prefab.id;
        }
        if (!prefabId && options.firstPrefabFrom) {
            prefabId = options.firstPrefabFrom.find(a => !!a.prefab).id;
        }
        if (!prefabId) {
            throw new Error("No prefab supplied to CreateFromPrefab");
        }
        return context.internal.CreateFromPrefab({
            prefabId,
            collisionLayer: options.collisionLayer,
            actor: options.actor
        });
    }
    /**
     * Load a glTF model, and spawn the first prefab in the resulting assets. Equivalent
     * to using [[AssetContainer.loadGltf]] and [[Actor.CreateFromPrefab]].
     * @param container The asset container to load the glTF assets into
     * @param options.uri A URI to a .gltf or .glb file
     * @param options.colliderType The type of collider to add to each mesh actor
     * @param options.actor The initial state of the actor
     */
    static CreateFromGltf(container, options) {
        let prefab;
        if (container.prefabs.find(p => p.source.uri === options.uri)) {
            prefab = container.prefabs.find(p => p.source.uri === options.uri);
            return Actor.CreateFromPrefab(container.context, { prefab, actor: options.actor });
        }
        else {
            return container.context.internal.CreateFromGltf(container, options);
        }
    }
    /**
     * Create an actor with a newly generated mesh. Equivalent to using
     * [[AssetContainer.createPrimitiveMesh]] and adding the result to [[Actor.Create]].
     * @param container The asset container to load the mesh into
     * @param options.definition The primitive shape and size
     * @param options.addCollider Add an auto-typed collider to the actor
     * @param options.actor The initial state of the actor
     */
    static CreatePrimitive(container, options) {
        const actor = options.actor || {};
        const mesh = container.createPrimitiveMesh(actor.name, options.definition);
        return Actor.Create(container.context, {
            actor: Object.assign(Object.assign({}, actor), { appearance: Object.assign(Object.assign({}, actor.appearance), { meshId: mesh.id }), collider: options.addCollider
                    ? actor.collider || { geometry: { shape: __1.ColliderType.Auto } }
                    : actor.collider })
        });
    }
    /**
     * Creates a Promise that will resolve once the actor is created on the host.
     * @returns Promise<void>
     */
    created() {
        if (!this.internal.created) {
            return new Promise((resolve, reject) => this.internal.enqueueCreatedPromise({ resolve, reject }));
        }
        if (this.internal.created.success) {
            return Promise.resolve();
        }
        else {
            return Promise.reject(this.internal.created.reason);
        }
    }
    /**
     * Destroys the actor.
     */
    destroy() {
        this.context.internal.destroyActor(this.id);
    }
    /**
     * Adds a light component to the actor.
     * @param light Light characteristics.
     */
    enableLight(light) {
        if (!this._light) {
            this._light = new __1.Light();
            // Actor patching: Observe the light component for changed values.
            internal_1.observe({
                target: this._light,
                targetName: 'light',
                notifyChanged: (...path) => this.actorChanged(...path),
                // Trigger notifications for every observed leaf node to ensure we get all values in the initial patch.
                triggerNotificationsNow: true
            });
        }
        // Copying the new values will trigger an actor update and enable/update the light component.
        this._light.copy(light);
    }
    /**
     * Adds a rigid body component to the actor.
     * @param rigidBody Rigid body characteristics.
     */
    enableRigidBody(rigidBody) {
        if (!this._rigidBody) {
            this._rigidBody = new __1.RigidBody(this);
            // Actor patching: Observe the rigid body component for changed values.
            internal_1.observe({
                target: this._rigidBody,
                targetName: 'rigidBody',
                notifyChanged: (...path) => this.actorChanged(...path),
                // Trigger notifications for every observed leaf node to ensure we get all values in the initial patch.
                triggerNotificationsNow: true
            });
        }
        // Copying the new values will trigger an actor update and enable/update the rigid body component.
        this._rigidBody.copy(rigidBody);
    }
    setCollider(colliderType, 
    // collisionLayer: CollisionLayer,
    isTrigger, size, center = { x: 0, y: 0, z: 0 }) {
        this._setCollider({
            enabled: true,
            isTrigger,
            geometry: { shape: colliderType, size, center }
        });
    }
    /**
     * Adds a text component to the actor.
     * @param text Text characteristics
     */
    enableText(text) {
        if (!this._text) {
            this._text = new __1.Text();
            // Actor patching: Observe the text component for changed values.
            internal_1.observe({
                target: this._text,
                targetName: 'text',
                notifyChanged: (...path) => this.actorChanged(...path),
                // Trigger notifications for every observed leaf node to ensure we get all values in the initial patch.
                triggerNotificationsNow: true
            });
        }
        // Copying the new values will trigger an actor update and enable/update the text component.
        this._text.copy(text);
    }
    /**
     * Instruct the actor to face another object, or stop facing an object.
     * @param actorOrActorId The Actor or id of the actor to face.
     * @param lookAtMode (Optional) How to face the target. @see LookUpMode.
     * @param backward (Optional) If true, actor faces away from target rather than toward.
     */
    enableLookAt(actorOrActorId, mode, backward) {
        // Resolve the actorId value.
        let actorId = __1.ZeroGuid;
        if (actorOrActorId instanceof Actor && actorOrActorId.id !== undefined) {
            actorId = actorOrActorId.id;
        }
        else if (typeof (actorOrActorId) === 'string') {
            actorId = actorOrActorId;
        }
        // Allocate component if necessary.
        if (!this._lookAt) {
            this._lookAt = new __1.LookAt();
            // Actor patching: Observe the lookAt component for changed values.
            internal_1.observe({
                target: this._lookAt,
                targetName: 'lookAt',
                notifyChanged: (...path) => this.actorChanged(...path),
                // Trigger notifications for every observed leaf node to ensure we get all values in the
                // initial patch.
                triggerNotificationsNow: true
            });
        }
        // Set component values.
        this._lookAt.copy({
            actorId,
            mode,
            backward
        });
    }
    /**
     * Attach to the user at the given attach point.
     * @param userOrUserId The User or id of user to attach to.
     * @param attachPoint Where on the user to attach.
     */
    attach(userOrUserId, attachPoint) {
        const userId = userOrUserId instanceof __1.User ? userOrUserId.id : userOrUserId;
        if (!this._attachment) {
            // Actor patching: Observe the attachment for changed values.
            this._attachment = new __1.Attachment();
            internal_1.observe({
                target: this._attachment,
                targetName: 'attachment',
                notifyChanged: (...path) => this.actorChanged(...path)
            });
        }
        this._attachment.userId = userId;
        this._attachment.attachPoint = attachPoint;
    }
    /**
     * If attached to a user, detach from it.
     */
    detach() {
        this._attachment.userId = __1.ZeroGuid;
        this._attachment.attachPoint = 'none';
    }
    /**
     * Subscribe to updates from this actor.
     * @param subscription The type of subscription to add.
     */
    subscribe(subscription) {
        this._subscriptions.push(subscription);
        this.actorChanged('subscriptions');
    }
    /**
     * Unsubscribe from updates from this actor.
     * @param subscription The type of subscription to remove.
     */
    unsubscribe(subscription) {
        this._subscriptions = this._subscriptions.filter(value => value !== subscription);
        this.actorChanged('subscriptions');
    }
    /**
     * Add a grad handler to be called when the given action state has changed.
     * @param grabState The grab state to fire the handler on.
     * @param handler The handler to call when the grab state has changed.
     */
    onGrab(grabState, handler) {
        const actionState = (grabState === 'begin') ? 'started' : 'stopped';
        this.grab.on(actionState, handler);
    }
    /**
     * Sets the behavior on this actor.
     * @param behavior The type of behavior to set. Pass null to clear the behavior.
     */
    setBehavior(behavior) {
        if (behavior) {
            const newBehavior = new behavior();
            this.internal.behavior = newBehavior;
            this.context.internal.setBehavior(this.id, this.internal.behavior.behaviorType);
            return newBehavior;
        }
        this.internal.behavior = null;
        this.context.internal.setBehavior(this.id, null);
        return null;
    }
    /**
     * Starts playing a preloaded sound.
     * @param soundAssetId Name of sound asset preloaded using AssetManager.
     * @param options Adjustments to pitch and volume, and other characteristics.
     */
    startSound(soundAssetId, options) {
        return new __1.MediaInstance(this, soundAssetId).start(options);
    }
    /**
     * Starts playing a preloaded video stream.
     * @param videoStreamAssetId Name of video stream asset preloaded using AssetManager.
     * @param options Adjustments to pitch and volume, and other characteristics.
     */
    startVideoStream(videoStreamAssetId, options) {
        return new __1.MediaInstance(this, videoStreamAssetId).start(options);
    }
    /**
     * @deprecated
     * Use [[Animation.AnimateTo]] instead.
     * @param value The desired final state of the actor.
     * @param duration The length of the interpolation (in seconds).
     * @param curve The cubic-bezier curve parameters. @see AnimationEaseCurves for predefined values.
     */
    animateTo(value, duration, curve) {
        // added this in because it's easy. not so for createAnimation.
        return __1.Animation.AnimateTo(this.context, this, {
            duration,
            destination: value,
            easing: curve
        });
    }
    /**
     * Finds child actors matching `name`.
     * @param name The name of the actors to find.
     * @param recurse Whether or not to search recursively.
     */
    findChildrenByName(name, recurse) {
        const namedChildren = this.children.filter(actor => actor.name === name);
        if (!recurse) {
            return namedChildren;
        }
        for (const child of this.children) {
            namedChildren.push(...child.findChildrenByName(name, recurse));
        }
        return namedChildren;
    }
    /** The list of animations that target this actor, by ID. */
    get targetingAnimations() {
        return this.context.animations
            .filter(anim => anim.targetIds.includes(this.id))
            .reduce((map, anim) => {
            map.set(anim.id, anim);
            return map;
        }, new Map());
    }
    /** The list of animations that target this actor, by name. */
    get targetingAnimationsByName() {
        return this.context.animations
            .filter(anim => anim.targetIds.includes(this.id) && anim.name)
            .reduce((map, anim) => {
            map.set(anim.name, anim);
            return map;
        }, new Map());
    }
    /** Recursively search for the named animation from this actor. */
    findAnimationInChildrenByName(name) {
        const namedAnims = this.targetingAnimationsByName;
        if (namedAnims.has(name)) {
            return namedAnims.get(name);
        }
        else {
            return this.children.reduce((val, child) => val || child.findAnimationInChildrenByName(name), null);
        }
    }
    /** @hidden */
    copy(from) {
        // Pause change detection while we copy the values into the actor.
        const wasObserving = this.internal.observing;
        this.internal.observing = false;
        if (!from) {
            return this;
        }
        if (from.id) {
            this._id = from.id;
        }
        if (from.parentId) {
            this._parentId = from.parentId;
        }
        if (from.name) {
            this._name = from.name;
        }
        if (from.tag) {
            this._tag = from.tag;
        }
        if (from.exclusiveToUser || from.parentId) {
            this._exclusiveToUser = this.parent && this.parent.exclusiveToUser || from.exclusiveToUser;
        }
        if (from.owner) {
            this._owner = from.owner;
        }
        if (from.transform) {
            this._transform.copy(from.transform);
        }
        if (from.attachment) {
            this.attach(from.attachment.userId, from.attachment.attachPoint);
        }
        if (from.appearance) {
            this._appearance.copy(from.appearance);
        }
        if (from.light) {
            this.enableLight(from.light);
        }
        if (from.rigidBody) {
            this.enableRigidBody(from.rigidBody);
        }
        if (from.collider) {
            this._setCollider(from.collider);
        }
        if (from.text) {
            this.enableText(from.text);
        }
        if (from.lookAt) {
            this.enableLookAt(from.lookAt.actorId, from.lookAt.mode);
        }
        if (from.grabbable !== undefined) {
            this._grabbable = from.grabbable;
        }
        this.internal.observing = wasObserving;
        return this;
    }
    /** @hidden */
    toJSON() {
        return {
            id: this._id,
            parentId: this._parentId,
            name: this._name,
            tag: this._tag,
            exclusiveToUser: this._exclusiveToUser,
            owner: this._owner,
            transform: this._transform.toJSON(),
            appearance: this._appearance.toJSON(),
            attachment: this._attachment ? this._attachment.toJSON() : undefined,
            light: this._light ? this._light.toJSON() : undefined,
            rigidBody: this._rigidBody ? this._rigidBody.toJSON() : undefined,
            collider: this._collider ? this._collider.toJSON() : undefined,
            text: this._text ? this._text.toJSON() : undefined,
            lookAt: this._lookAt ? this._lookAt.toJSON() : undefined,
            grabbable: this._grabbable
        };
    }
    static sanitize(msg) {
        msg = internal_1.resolveJsonValues(msg);
        if (msg.appearance) {
            msg.appearance = __1.Appearance.sanitize(msg.appearance);
        }
        return msg;
    }
    /**
     * PRIVATE METHODS
     */
    generateColliderGeometry(colliderType, size, center = { x: 0, y: 0, z: 0 }) {
        switch (colliderType) {
            case __1.ColliderType.Box:
                return {
                    shape: __1.ColliderType.Box,
                    center,
                    size: size
                };
            case __1.ColliderType.Sphere:
                return {
                    shape: __1.ColliderType.Sphere,
                    center,
                    radius: size
                };
            case __1.ColliderType.Capsule:
                return {
                    shape: __1.ColliderType.Capsule,
                    center,
                    size: size
                };
            case 'auto':
                return {
                    shape: __1.ColliderType.Auto
                };
            default:
                __1.log.error(null, 'Trying to enable a collider on the actor with an invalid collider geometry type.' +
                    `Type given is ${colliderType}`);
                return undefined;
        }
    }
    _setCollider(collider) {
        let size = null;
        let center = null;
        if (collider.geometry.shape === __1.ColliderType.Box) {
            size = collider.geometry.size;
            center = collider.geometry.center;
        }
        else if (collider.geometry.shape === __1.ColliderType.Sphere) {
            size = collider.geometry.radius;
            center = collider.geometry.center;
        }
        else if (collider.geometry.shape === __1.ColliderType.Capsule) {
            size = collider.geometry.size;
            center = collider.geometry.center;
        }
        const geometry = this.generateColliderGeometry(collider.geometry.shape, size, center);
        if (geometry) {
            collider = Object.assign(Object.assign({}, collider), { geometry });
            const oldCollider = this._collider;
            if (this._collider) {
                internal_1.unobserve(this._collider);
                this._collider = undefined;
            }
            this._collider = new __1.Collider(this, collider);
            if (oldCollider) {
                this._collider.internal.copyHandlers(oldCollider.internal);
            }
            // Actor patching: Observe the collider component for changed values.
            internal_1.observe({
                target: this._collider,
                targetName: 'collider',
                notifyChanged: (...path) => this.actorChanged(...path),
                // Trigger notifications for every observed leaf node to ensure we get all values in the initial patch.
                triggerNotificationsNow: true
            });
        }
    }
}
exports.Actor = Actor;
//# sourceMappingURL=actor.js.map