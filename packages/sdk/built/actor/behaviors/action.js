"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscreteAction = void 0;
/**
 * Class that represents a discrete action that can be in one of two states,
 * started or stopped for each user. @see ActionState
 */
class DiscreteAction {
    constructor() {
        this.handlers = {};
        this.activeUserIds = [];
    }
    /**
     * Add a handler for the given action state for when it is triggered.
     * @param actionState The action state that the handle should be assigned to.
     * @param handler The handler to call when the action state is triggered.
     */
    on(actionState, handler) {
        this.handlers[actionState] = handler;
        return this;
    }
    /**
     * Gets the current state of the action for the user with the given id.
     * @param user The user to get the action state for.
     * @returns The current state of the action for the user.
     */
    getState(user) {
        return this.activeUserIds.find(id => id === user.id) ?
            'performing' : 'stopped';
    }
    /**
     * Get whether the action is active for the user with the given id.
     * @param user - The user to get whether the action is active for, or null
     * if active for any user is desired..
     * @returns - True if the action is active for the user, false if it is not.  In the case
     * that no user is given, the value is true if the action is active for any user, and false
     * if not.
     */
    isActive(user) {
        if (user) {
            return !!this.activeUserIds.find(id => id === user.id);
        }
        else {
            return this.activeUserIds.length > 0;
        }
    }
    /**
     * INTERNAL METHODS
     */
    /** @hidden */
    _performAction(user, actionState, actionData) {
        const currentState = this.activeUserIds.find(id => id === user.id) || 'stopped';
        if (currentState !== actionState) {
            if (actionState === 'started') {
                this.activeUserIds.push(user.id);
            }
            else if (actionState === 'stopped') {
                this.activeUserIds = this.activeUserIds.filter(id => id === user.id);
            }
            const handler = this.handlers[actionState];
            if (handler) {
                handler(user, actionData);
            }
            return true;
        }
        return false;
    }
}
exports.DiscreteAction = DiscreteAction;
//# sourceMappingURL=action.js.map