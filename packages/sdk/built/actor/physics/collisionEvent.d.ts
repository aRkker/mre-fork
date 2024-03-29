/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { CollisionData, CollisionEventType, Guid } from '../..';
/**
 * A collision event that has occured between physics objects.
 */
export interface CollisionEvent {
    colliderOwnerId: Guid;
    eventType: CollisionEventType;
    collisionData: CollisionData;
}
//# sourceMappingURL=collisionEvent.d.ts.map