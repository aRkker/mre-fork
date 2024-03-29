/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
/**
 * A [[UserFilter]] that validates that all users in the session are joined to the same AltspaceVR event or space.
 * Useful to prevent trolling from an unofficial room.
 *
 * @example Filter user joins and leaves by listening to this class's events instead of the main MRE context:
 *
 * ```js
 * const userFilter = new SingleEventFilter(context);
 * userFilter.onUserJoined(user => calledOnlyForValidatedUsers(user));
 * userFilter.onUserLeft(user => calledOnlyForValidatedUsers(user));
 * ```
 *
 * @example Can be used to filter out input actions:
 *
 * ```js
 * button.setBehavior(MRE.ButtonBehavior)
 * .onClick(userFilter.filterInput((user, evtData) => calledOnlyForValidatedUsers(user, evtData)));
 * ```
 *
 * @example Can be daisy-chained with other user filters:
 *
 * ```js
 * const filter = new ModeratorFilter(new SingleEventFilter(context));
 * ```
 */
export declare class SingleEventFilter extends MRE.UserFilter {
    private eventOrSpaceId;
    /** @inheritdoc */
    constructor(context: MRE.UserEntryExitPoint);
    protected shouldForwardUserEvent(user: MRE.User): boolean;
}
//# sourceMappingURL=singleEventFilter.d.ts.map