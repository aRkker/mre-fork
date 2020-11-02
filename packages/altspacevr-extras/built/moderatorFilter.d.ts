/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
/**
 * A class that filters users by whether they are moderators in the AltspaceVR room.
 *
 * @example Filter user joins and leaves by listening to this class's events instead of the main MRE context:
 *
 * ```js
 * const userFilter = new ModeratorFilter(context);
 * userFilter.onUserJoined(user => calledOnlyForModerators(user));
 * userFilter.onUserLeft(user => calledOnlyForModerators(user));
 * ```
 *
 * @example Can be used to filter out input actions by moderator status:
 *
 * ```js
 * modControl.setBehavior(MRE.ButtonBehavior)
 * .onClick(userFilter.filterInput((user, evtData) => calledOnlyForModerators(user, evtData)));
 * ```
 *
 * @example Can be daisy-chained with other user filters:
 *
 * ```js
 * const filter = new ModeratorFilter(new SingleEventFilter(context));
 * ```
 */
export declare class ModeratorFilter extends MRE.UserFilter {
    private allowOnlyOneModerator;
    private singleModeratorId;
    /**
     * Set up the moderator filter
     * @param context An MRE.Context object, or another user filter instance
     * @param allowOnlyOneModerator If true, only the first moderator to join the session passes the filter. Useful
     * to prevent multi-room session attacks.
     */
    constructor(context: MRE.UserEntryExitPoint, allowOnlyOneModerator?: boolean);
    protected shouldForwardUserEvent(user: MRE.User, eventType: MRE.UserInteractionType): boolean;
}
//# sourceMappingURL=moderatorFilter.d.ts.map