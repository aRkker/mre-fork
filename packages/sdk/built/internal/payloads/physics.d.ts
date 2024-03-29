/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Payloads } from '../../internal';
import { CollisionData, CollisionEventType, Guid, TriggerEventType, QuaternionLike, Vector3Like } from '../..';
import { PhysicsBridgeTransformUpdate, PhysicsUploadServerTransformsUpdate } from '../../actor/physics/physicsBridge';
/**
 * @hidden
 * App to engine.  Send a rigidbody command
 */
export declare type RigidBodyCommands = Payloads.Payload & {
    type: 'rigidbody-commands';
    actorId: Guid;
    commandPayloads: Payloads.Payload[];
};
/**
 * @hidden
 * App to engine. Move position of rigidbody
 */
export declare type RigidBodyMovePosition = Payloads.Payload & {
    type: 'rigidbody-move-position';
    position: Partial<Vector3Like>;
};
/**
 * @hidden
 * App to engine. Move rotation of rigidbody
 */
export declare type RigidBodyMoveRotation = Payloads.Payload & {
    type: 'rigidbody-move-rotation';
    rotation: QuaternionLike;
};
/**
 * @hidden
 * App to engine. Add force rigidbody command
 */
export declare type RigidBodyAddForce = Payloads.Payload & {
    type: 'rigidbody-add-force';
    force: Partial<Vector3Like>;
};
/**
 * @hidden
 * App to engine. Add force at position rigidbody command
 */
export declare type RigidBodyAddForceAtPosition = Payloads.Payload & {
    type: 'rigidbody-add-force-at-position';
    force: Partial<Vector3Like>;
    position: Partial<Vector3Like>;
};
/**
 * @hidden
 * App to engine. Add force rigidbody command
 */
export declare type RigidBodyAddTorque = Payloads.Payload & {
    type: 'rigidbody-add-torque';
    torque: Partial<Vector3Like>;
};
/**
 * @hidden
 * App to engine. Add force at position rigidbody command
 */
export declare type RigidBodyAddRelativeTorque = Payloads.Payload & {
    type: 'rigidbody-add-relative-torque';
    relativeTorque: Partial<Vector3Like>;
};
/**
 * @hidden
 * Engine to app. Collision event data from engine after a collision has occured.
 */
export declare type CollisionEventRaised = Payloads.Payload & {
    type: 'collision-event-raised';
    actorId: Guid;
    eventType: CollisionEventType;
    collisionData: CollisionData;
};
/**
 * @hidden
 * Engine to app.  Trigger event data from engine after a trigger event has occured.
 */
export declare type TriggerEventRaised = Payloads.Payload & {
    type: 'trigger-event-rasied';
    actorId: Guid;
    eventType: TriggerEventType;
    otherActorId: Guid;
};
export declare type PhysicsBridgeUpdate = Payloads.Payload & {
    type: 'physicsbridge-transforms-update';
    transforms: Partial<PhysicsBridgeTransformUpdate>;
};
export declare type PhysicsUploadServerUpdate = Payloads.Payload & {
    type: 'physicsbridge-server-transforms-upload';
    physicsTranformServer: Partial<PhysicsUploadServerTransformsUpdate>;
};
//# sourceMappingURL=physics.d.ts.map