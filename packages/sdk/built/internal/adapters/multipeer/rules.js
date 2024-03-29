"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rules = exports.MissingRule = exports.DefaultRule = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const internal_1 = require("../../../internal");
const __1 = require("../../..");
/**
 * @hidden
 * The DefaultRule provides reasonable default rule settings, ensuring all fields are assigned.
 */
exports.DefaultRule = {
    synchronization: {
        stage: 'always',
        before: 'allow',
        during: 'allow',
        after: 'allow'
    },
    client: {
        timeoutSeconds: 0,
        beforeQueueMessageForClient: (session, client, message, promise) => {
            return message;
        },
        shouldSendToUser: () => null,
    },
    session: {
        beforeReceiveFromApp: (session, message) => {
            return message;
        },
        beforeReceiveFromClient: (session, client, message) => {
            return message;
        }
    }
};
/**
 * @hidden
 * MissingRule alerts the SDK developer that they need to define a Rule for the payload.
 */
exports.MissingRule = Object.assign(Object.assign({}, exports.DefaultRule), { client: Object.assign(Object.assign({}, exports.DefaultRule.client), { beforeQueueMessageForClient: (session, client, message, promise) => {
            __1.log.error('app', `[ERROR] No rule defined for payload ${message.payload.type}! Add an entry in rules.ts.`);
            return message;
        } }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
            __1.log.error('app', `[ERROR] No rule defined for payload ${message.payload.type}! Add an entry in rules.ts.`);
            return message;
        }, beforeReceiveFromClient: (session, client, message) => {
            __1.log.error('app', `[ERROR] No rule defined for payload ${message.payload.type}! Add an entry in rules.ts.`);
            return message;
        } }) });
/**
 * @hidden
 * Handling for client-only messages.
 */
const ClientOnlyRule = Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
        stage: 'always',
        before: 'error',
        during: 'error',
        after: 'error'
    }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { beforeQueueMessageForClient: (session, client, message, promise) => {
            __1.log.error('network', `[ERROR] session tried to queue a client-only message: ${message.payload.type}!`);
            return message;
        } }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
            __1.log.error('network', `[ERROR] app tried to send a client-only message: ${message.payload.type}!`);
            return undefined;
        } }) });
/**
 * @hidden
 * Handling for actor creation messages
 */
const CreateActorRule = Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
        stage: 'create-actors',
        before: 'ignore',
        during: 'queue',
        after: 'allow'
    }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { shouldSendToUser: (message, userId, session, client) => {
            const exclusiveUser = session.actorSet.get(message.payload.actor.id).exclusiveToUser;
            return exclusiveUser ? exclusiveUser === userId : null;
        } }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
            session.cacheInitializeActorMessage(message);
            session.cacheAnimationCreationRequest(message);
            return message;
        } }) });
/**
 * @hidden
 * A global collection of message rules used by different parts of the multipeer adapter.
 * Getting a compiler error here? It is likely that `Rules` is missing a rule for the new payload type you added.
 * *** KEEP ENTRIES SORTED ***
 */
exports.Rules = {
    // ========================================================================
    'actor-correction': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-actors',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { beforeQueueMessageForClient: (session, client, message, promise) => {
                // Coalesce this actor correction with the previously queued update if it exists, maintaining a single
                // update for this actor rather than queuing a series of them.  This is fine, as we do not need to lerp
                // an actor correction on a late join user.  It can just be the updated actor values.
                const payload = message.payload;
                const queuedMessage = client.queuedMessages
                    .filter(value => value.message.payload.type === 'actor-update' &&
                    value.message.payload.actor.id === payload.actorId).shift();
                if (queuedMessage) {
                    const existingPayload = queuedMessage.message.payload;
                    existingPayload.actor = deepmerge_1.default(existingPayload.actor, {
                        actor: {
                            transform: {
                                app: message.payload.appTransform
                            }
                        }
                    });
                    // We have merged the actor correction in to an existing actor update.  We do not want to
                    // propagate the correction message further.
                    return undefined;
                }
                return message;
            } }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromClient: (session, client, message) => {
                const syncActor = session.actorSet.get(message.payload.actorId);
                if (syncActor && ((!syncActor.grabbedBy)
                    || (syncActor.grabbedBy === client.id))) {
                    const correctionPayload = message.payload;
                    // Synthesize an actor update message and add in the transform from the correction payload.
                    // Send this to the cacheActorUpdateMessage call.
                    const updateMessage = {
                        payload: {
                            type: 'actor-update',
                            actor: {
                                id: correctionPayload.actorId,
                                transform: {
                                    app: correctionPayload.appTransform
                                }
                            }
                        }
                    };
                    // Merge the update into the existing actor.
                    session.cacheActorUpdateMessage(updateMessage);
                    // Sync the change to the other clients.
                    session.sendPayloadToClients(correctionPayload, (value) => value.id !== client.id);
                    // Determine whether to forward the message to the app based on subscriptions.
                    let shouldSendToApp = false;
                    const subscriptions = syncActor.initialization.message.payload.actor.subscriptions || [];
                    if (correctionPayload.appTransform &&
                        Object.keys(correctionPayload.appTransform) &&
                        subscriptions.includes('transform')) {
                        shouldSendToApp = true;
                    }
                    // If we should sent to the app, then send the synthesized actor update instead, as correction
                    // messages are just for clients.
                    return shouldSendToApp ? updateMessage : undefined;
                }
            } }) }),
    // ========================================================================
    'actor-update': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-actors',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { beforeQueueMessageForClient: (session, client, message, promise) => {
                // Coalesce this update with the previously queued update if it exists, maintaining a single
                // update for this actor rather than queuing a series of them.
                const payload = message.payload;
                const queuedMessage = client.queuedMessages
                    .filter(value => value.message.payload.type === 'actor-update' &&
                    value.message.payload.actor.id === payload.actor.id).shift();
                if (queuedMessage) {
                    const existingPayload = queuedMessage.message.payload;
                    existingPayload.actor = deepmerge_1.default(existingPayload.actor, payload.actor);
                    // We have merged the actor update in to an existing actor update.  We do not want to
                    // propagate the update message further.
                    return undefined;
                }
                return message;
            }, shouldSendToUser: (message, userId, session, client) => {
                const exclusiveUser = session.actorSet.get(message.payload.actor.id).exclusiveToUser;
                return exclusiveUser ? exclusiveUser === userId : null;
            } }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                session.cacheActorUpdateMessage(message);
                return message;
            }, beforeReceiveFromClient: (session, client, message) => {
                const syncActor = session.actorSet.get(message.payload.actor.id);
                if (syncActor && ((!syncActor.grabbedBy) ||
                    (syncActor.grabbedBy === client.id))) {
                    // Merge the update into the existing actor.
                    session.cacheActorUpdateMessage(message);
                    // Make a copy of the message so we can modify it.
                    const payloadForClients = deepmerge_1.default(message.payload, {});
                    // If animating, don't sync transform changes with other clients (animations are desynchronized)
                    if (session.isAnimating(syncActor)) {
                        delete payloadForClients.actor.transform;
                    }
                    // Don't sync to other clients if the actor patch is empty.
                    // (if keys.length === 1, it only contains the actor.id field)
                    if (Object.keys(payloadForClients.actor).length > 1) {
                        // Sync the change to the other clients.
                        session.sendPayloadToClients(payloadForClients, (value) => value.id !== client.id);
                    }
                    // Determine whether to forward the message to the app based on subscriptions.
                    let shouldSendToApp = false;
                    const subscriptions = syncActor.initialization.message.payload.actor.subscriptions || [];
                    if (message.payload.actor.transform &&
                        Object.keys(message.payload.actor.transform) &&
                        subscriptions.includes('transform')) {
                        shouldSendToApp = true;
                    }
                    else if (message.payload.actor.rigidBody &&
                        Object.keys(message.payload.actor.rigidBody) &&
                        subscriptions.includes('rigidbody')) {
                        shouldSendToApp = true;
                    }
                    return shouldSendToApp ? message : undefined;
                }
            } }) }),
    // ========================================================================
    'animation-update': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'sync-animations',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { shouldSendToUser: (message, userId, session) => {
                // TODO: don't send animation updates when the animation targets only actors
                // the client doesn't care/know about.
                return true;
            } }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                session.cacheAnimationUpdate(message);
                return message;
            }, beforeReceiveFromClient: (session, client, message) => {
                if (client.authoritative) {
                    session.cacheAnimationUpdate(message);
                    return message;
                }
            } }) }),
    // ========================================================================
    'app2engine-rpc': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'always',
            before: 'queue',
            during: 'queue',
            after: 'allow'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { shouldSendToUser: (message, userId, session, client) => {
                // If the AppToEngineRPC message targets a specific user, filter to that user.
                const exclusiveUser = message.payload.userId;
                return exclusiveUser ? exclusiveUser === userId : null;
            } }) }),
    // ========================================================================
    'asset-update': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'load-assets',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                session.cacheAssetUpdate(message);
                return message;
            } }) }),
    // ========================================================================
    'assets-loaded': Object.assign(Object.assign({}, ClientOnlyRule), { session: Object.assign(Object.assign({}, ClientOnlyRule.session), { beforeReceiveFromClient: (session, client, message) => {
                var _a;
                if (client.authoritative) {
                    for (const asset of (_a = message.payload.assets) !== null && _a !== void 0 ? _a : []) {
                        session.cacheAssetCreation(asset.id, message.replyToId, (asset.sound && asset.sound.duration) ||
                            (asset.videoStream && asset.videoStream.duration));
                    }
                    return message;
                }
                else if (message.payload.failureMessage && message.payload.failureMessage.length) {
                    // TODO: Propagate to app as a general failure message once
                    // we have created the error event handler message path.
                }
            } }) }),
    // ========================================================================
    'collision-event-raised': Object.assign({}, ClientOnlyRule),
    // ========================================================================
    'create-animation-2': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-animations',
            before: 'ignore',
            during: 'allow',
            after: 'allow'
        }, session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                session.cacheAnimationCreationRequest(message);
                return message;
            } }) }),
    // ========================================================================
    'create-asset': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'load-assets',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                session.cacheAssetCreationRequest(message);
                return message;
            } }) }),
    // ========================================================================
    'create-empty': CreateActorRule,
    // ========================================================================
    'create-from-library': CreateActorRule,
    // ========================================================================
    'create-from-prefab': CreateActorRule,
    // ========================================================================
    'destroy-actors': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-actors',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                for (const actorId of message.payload.actorIds) {
                    session.actorSet.delete(actorId);
                }
                return message;
            } }) }),
    // ========================================================================
    'destroy-animations': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-animations',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                session.cacheAnimationUnload(message);
                return message;
            } }) }),
    // ========================================================================
    'dialog-response': ClientOnlyRule,
    // ========================================================================
    'engine2app-rpc': ClientOnlyRule,
    // ========================================================================
    'handshake': Object.assign(Object.assign({}, ClientOnlyRule), { client: Object.assign(Object.assign({}, ClientOnlyRule.client), { timeoutSeconds: 30 }) }),
    // ========================================================================
    'handshake-complete': ClientOnlyRule,
    // ========================================================================
    'handshake-reply': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'always',
            before: 'error',
            during: 'error',
            after: 'error'
        } }),
    // ========================================================================
    'heartbeat': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'always',
            before: 'allow',
            during: 'allow',
            after: 'allow',
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { timeoutSeconds: 30 }) }),
    // ========================================================================
    'heartbeat-reply': ClientOnlyRule,
    // ========================================================================
    'load-assets': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'load-assets',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { timeoutSeconds: 30 }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                session.cacheAssetCreationRequest(message);
                return message;
            } }) }),
    // ========================================================================
    'multi-operation-result': ClientOnlyRule,
    // ========================================================================
    'object-spawned': Object.assign(Object.assign({}, ClientOnlyRule), { session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromClient: (session, client, message) => {
                var _a;
                // Check that this is the authoritative client
                const actors = message.payload.actors;
                const exclusiveUser = (actors === null || actors === void 0 ? void 0 : actors.length) > 0 && session.actorSet.has((_a = actors[0]) === null || _a === void 0 ? void 0 : _a.id) ?
                    session.actorSet.get(actors[0].id).exclusiveToUser :
                    undefined;
                if (client.authoritative || client.userId && client.userId === exclusiveUser) {
                    // Create no-op creation message. Implicit sync from initialization until they're updated
                    for (const spawned of message.payload.actors || []) {
                        session.cacheInitializeActorMessage({
                            payload: {
                                type: 'actor-update',
                                actor: { id: spawned.id, parentId: spawned.parentId }
                            }
                        });
                    }
                    // create somewhere to store anim updates
                    for (const newAnim of message.payload.animations || []) {
                        session.cacheAnimationCreation(message.replyToId, newAnim);
                    }
                    // Allow the message to propagate to the app.
                    return message;
                }
            } }) }),
    // ========================================================================
    'operation-result': Object.assign(Object.assign({}, ClientOnlyRule), { session: Object.assign({}, exports.DefaultRule.session) }),
    // ========================================================================
    'perform-action': Object.assign(Object.assign({}, ClientOnlyRule), { session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromClient: (session, client, message) => {
                // Store the client id of the client that is performing the grab.
                if (process.env.PROCESS_PERFORM_ACTIONS === '0'
                    &&
                        (message.payload.actionName.toLowerCase() !== 'grab' &&
                            message.payload.actionName.toLowerCase() !== 'click')) {
                    return;
                }
                const payload = message.payload;
                const syncActor = session.actorSet.get(payload.targetId);
                if (syncActor && payload.actionName.toLowerCase() === 'grab' &&
                    (syncActor.grabbedBy === client.id || syncActor.grabbedBy === undefined)) {
                    syncActor.grabbedBy = payload.actionState === 'started' ? client.id : undefined;
                }
                return message;
            } }) }),
    // ========================================================================
    'physicsbridge-transforms-update': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'always',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { beforeQueueMessageForClient: (session, client, message, promise) => {
                if (process.env.PROCESS_PHYSICS_BRIDGE_SHIT === '0') {
                    return;
                }
                return message;
            }, shouldSendToUser: (message, userId, session, client) => {
                if (process.env.PROCESS_PHYSICS_BRIDGE_SHIT === '0') {
                    return false;
                }
                return true;
            } }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                return message;
            }, beforeReceiveFromClient: (session, client, message) => {
                if (process.env.PROCESS_PHYSICS_BRIDGE_SHIT === '0') {
                    return;
                }
                session.sendPayloadToClients(message.payload, (value) => value.id !== client.id);
                return message;
            } }) }),
    // ========================================================================
    'physicsbridge-server-transforms-upload': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'always',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { beforeQueueMessageForClient: (session, client, message, promise) => {
                return message;
            }, shouldSendToUser: (message, userId, session, client) => {
                // this is just upload do not sending anything to clients
                return false;
            } }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                return message;
            }, beforeReceiveFromClient: (session, client, message) => {
                // update directly the transforms
                for (const entry of message.payload.physicsTranformServer.updates) {
                    const syncActor = session.actorSet.get(entry.actorGuid);
                    if (syncActor) {
                        syncActor.initialization.message.payload.actor.transform.app = entry.appTransform;
                        syncActor.initialization.message.payload.actor.transform.local.position =
                            entry.localTransform.position;
                        syncActor.initialization.message.payload.actor.transform.local.rotation =
                            entry.localTransform.rotation;
                    }
                }
                return message;
            } }) }),
    // ========================================================================
    'rigidbody-add-force': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-actors',
            before: 'queue',
            during: 'queue',
            after: 'allow'
        } }),
    // ========================================================================
    'rigidbody-add-force-at-position': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-actors',
            before: 'queue',
            during: 'queue',
            after: 'allow'
        } }),
    // ========================================================================
    'rigidbody-add-relative-torque': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-actors',
            before: 'queue',
            during: 'queue',
            after: 'allow'
        } }),
    // ========================================================================
    'rigidbody-add-torque': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-actors',
            before: 'queue',
            during: 'queue',
            after: 'allow'
        } }),
    // ========================================================================
    'rigidbody-commands': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-actors',
            before: 'queue',
            during: 'queue',
            after: 'allow'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { shouldSendToUser: (message, userId, session, client) => {
                const exclusiveUser = session.actorSet.get(message.payload.actorId).exclusiveToUser;
                return exclusiveUser ? exclusiveUser === userId : null;
            } }) }),
    // ========================================================================
    'rigidbody-move-position': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-actors',
            before: 'queue',
            during: 'queue',
            after: 'allow'
        } }),
    // ========================================================================
    'rigidbody-move-rotation': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'create-actors',
            before: 'queue',
            during: 'queue',
            after: 'allow'
        } }),
    // ========================================================================
    'set-authoritative': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'always',
            before: 'error',
            during: 'error',
            after: 'error'
        } }),
    // ========================================================================
    'set-behavior': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'set-behaviors',
            before: 'ignore',
            during: 'allow',
            after: 'allow'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { shouldSendToUser: (message, userId, session, client) => {
                const exclusiveUser = session.actorSet.get(message.payload.actorId).exclusiveToUser;
                return exclusiveUser ? exclusiveUser === userId : null;
            } }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                const syncActor = session.actorSet.get(message.payload.actorId);
                if (syncActor) {
                    syncActor.behavior = message.payload.behaviorType;
                }
                else {
                    __1.log.error('app', `Sync: set-behavior on unknown actor ${message.payload.actorId}`);
                }
                return message;
            } }) }),
    // ========================================================================
    'set-media-state': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'active-media-instances',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { shouldSendToUser: (message, userId, session, client) => {
                const exclusiveUser = session.actorSet.get(message.payload.actorId) ?
                    session.actorSet.get(message.payload.actorId).exclusiveToUser :
                    null;
                return exclusiveUser ? exclusiveUser === userId : null;
            } }), session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                const syncActor = session.actorSet.get(message.payload.actorId);
                if (syncActor) {
                    syncActor.activeMediaInstances = syncActor.activeMediaInstances || [];
                    let activeMediaInstance;
                    const basisTime = Date.now() / 1000.0;
                    if (message.payload.mediaCommand === __1.MediaCommand.Start) {
                        // Garbage collect expired media instances when adding a new media instance on an actor
                        syncActor.activeMediaInstances = syncActor.activeMediaInstances.filter(item => item.expirationTime === undefined ||
                            basisTime <= item.expirationTime);
                        // Prepare the new media instance
                        activeMediaInstance = { message, basisTime, expirationTime: undefined };
                    }
                    else {
                        // find the existing message that needs to be updated
                        activeMediaInstance = syncActor.activeMediaInstances.filter(item => item.message.payload.id === message.payload.id).shift();
                        // if sound expired then skip this message completely
                        if (!activeMediaInstance) {
                            return undefined;
                        }
                        // Remove the existing sound instance (we'll add an updated one below).
                        syncActor.activeMediaInstances =
                            syncActor.activeMediaInstances.filter(item => item.message.payload.id !== message.payload.id);
                        if (activeMediaInstance.expirationTime !== undefined) {
                            if (basisTime > activeMediaInstance.expirationTime) {
                                // non-looping mediainstance has completed, so ignore it, which will remove it
                                // from the list
                                return undefined;
                            }
                        }
                        // store the updated sound instance if sound isn't stopping
                        if (message.payload.mediaCommand === __1.MediaCommand.Stop) {
                            return message;
                        }
                        // if speed or position changes, reset basistime and recalculate the time.
                        if (message.payload.options.time !== undefined) {
                            // a time change(seek) just needs to reset basis time. The payload merge does the rest
                            activeMediaInstance.basisTime = basisTime;
                        }
                        else if (message.payload.options.paused !== undefined ||
                            message.payload.options.pitch !== undefined) {
                            // if the media instance wasn't paused, then recalculate the current time
                            // if media instance was paused then current time doesn't change
                            if (activeMediaInstance.message.payload.options.paused !== true) {
                                if (activeMediaInstance.message.payload.options.time === undefined) {
                                    activeMediaInstance.message.payload.options.time = 0.0;
                                }
                                let timeOffset = (basisTime - activeMediaInstance.basisTime);
                                if (activeMediaInstance.message.payload.options.pitch !== undefined) {
                                    timeOffset *= Math.pow(2.0, (activeMediaInstance.message.payload.options.pitch / 12.0));
                                }
                                activeMediaInstance.message.payload.options.time += timeOffset;
                            }
                            activeMediaInstance.basisTime = basisTime;
                        }
                        // merge existing payload and new payload
                        activeMediaInstance.message.payload.options = Object.assign(Object.assign({}, activeMediaInstance.message.payload.options), message.payload.options);
                    }
                    // Look up asset duration from cached assets
                    const asset = session.assetSet.get(message.payload.mediaAssetId);
                    if (activeMediaInstance.message.payload.options.looping === true ||
                        activeMediaInstance.message.payload.options.paused === true ||
                        (asset === undefined || asset.duration === undefined || asset.duration === 0)) {
                        // media instance current will last forever
                        activeMediaInstance.expirationTime = undefined;
                    }
                    else {
                        // media instance will expire automatically
                        let timeRemaining = asset.duration;
                        if (activeMediaInstance.message.payload.options.time !== undefined) {
                            timeRemaining -= activeMediaInstance.message.payload.options.time;
                        }
                        if (activeMediaInstance.message.payload.options.pitch !== undefined) {
                            timeRemaining /= Math.pow(2.0, (activeMediaInstance.message.payload.options.pitch / 12.0));
                        }
                        activeMediaInstance.expirationTime = basisTime + timeRemaining;
                    }
                    syncActor.activeMediaInstances.push(activeMediaInstance);
                }
                return message;
            } }) }),
    // ========================================================================
    'show-dialog': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'never',
            before: 'ignore',
            during: 'ignore',
            after: 'ignore'
        }, client: Object.assign(Object.assign({}, exports.DefaultRule.client), { shouldSendToUser: (message, userId) => {
                return message.payload.userId === userId;
            } }) }),
    // ========================================================================
    'sync-complete': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'always',
            before: 'error',
            during: 'error',
            after: 'allow'
        } }),
    // ========================================================================
    'sync-request': ClientOnlyRule,
    // ========================================================================
    'traces': ClientOnlyRule,
    // ========================================================================
    'trigger-event-raised': ClientOnlyRule,
    // ========================================================================
    'unload-assets': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'load-assets',
            before: 'ignore',
            during: 'queue',
            after: 'allow'
        }, session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                session.cacheAssetUnload(message.payload.containerId);
                return message;
            } }) }),
    // ========================================================================
    'user-joined': Object.assign(Object.assign({}, ClientOnlyRule), { session: Object.assign(Object.assign({}, ClientOnlyRule.session), { beforeReceiveFromClient: (session, client, message) => {
                // Add remote ip address to the joining user.
                const props = message.payload.user.properties = message.payload.user.properties || {};
                if (client.conn instanceof internal_1.WebSocket && !props.remoteAddress) {
                    props.remoteAddress = client.conn.remoteAddress;
                }
                return message;
            } }) }),
    // ========================================================================
    'user-left': ClientOnlyRule,
    // ========================================================================
    'user-update': Object.assign(Object.assign({}, exports.DefaultRule), { session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                const client = session.clients.find(c => c.userId === message.payload.user.id);
                if (client) {
                    client.send(message);
                }
                return null;
            } }) }),
    // ========================================================================
    'x-reserve-actor': Object.assign(Object.assign({}, exports.DefaultRule), { synchronization: {
            stage: 'never',
            before: 'ignore',
            during: 'ignore',
            after: 'ignore'
        }, session: Object.assign(Object.assign({}, exports.DefaultRule.session), { beforeReceiveFromApp: (session, message) => {
                session.cacheInitializeActorMessage(message);
                return null;
            } }) })
};
//# sourceMappingURL=rules.js.map