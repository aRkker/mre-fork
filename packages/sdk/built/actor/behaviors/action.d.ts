/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ActionState, User } from '../..';
/**
 * The action handler function type.
 */
export declare type ActionHandler<ActionDataT = void> = (user: User, actionData?: ActionDataT) => void;
/**
 * @hidden
 */
export interface Actionable {
    _performAction(user: User, actionState: ActionState, actionData?: any): boolean;
}
/**
 * Class that represents a discrete action that can be in one of two states,
 * started or stopped for each user. @see ActionState
 */
export declare class DiscreteAction<ActionDataT = void> implements Actionable {
    private handlers;
    private activeUserIds;
    /**
     * Add a handler for the given action state for when it is triggered.
     * @param actionState The action state that the handle should be assigned to.
     * @param handler The handler to call when the action state is triggered.
     */
    on(actionState: ActionState, handler: ActionHandler<ActionDataT>): this;
    /**
     * Gets the current state of the action for the user with the given id.
     * @param user The user to get the action state for.
     * @returns The current state of the action for the user.
     */
    getState(user: User): ActionState;
    /**
     * Get whether the action is active for the user with the given id.
     * @param user - The user to get whether the action is active for, or null
     * if active for any user is desired..
     * @returns - True if the action is active for the user, false if it is not.  In the case
     * that no user is given, the value is true if the action is active for any user, and false
     * if not.
     */
    isActive(user?: User): boolean;
    /**
     * INTERNAL METHODS
     */
    /** @hidden */
    _performAction(user: User, actionState: ActionState, actionData?: any): boolean;
}
//# sourceMappingURL=action.d.ts.map