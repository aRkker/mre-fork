"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
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
class ModeratorFilter extends MRE.UserFilter {
    /**
     * Set up the moderator filter
     * @param context An MRE.Context object, or another user filter instance
     * @param allowOnlyOneModerator If true, only the first moderator to join the session passes the filter. Useful
     * to prevent multi-room session attacks.
     */
    constructor(context, allowOnlyOneModerator = false) {
        super(context);
        this.allowOnlyOneModerator = allowOnlyOneModerator;
    }
    shouldForwardUserEvent(user, eventType) {
        var _a;
        const userRoles = new Set((_a = user.properties['altspacevr-roles']) === null || _a === void 0 ? void 0 : _a.split(','));
        if (this.allowOnlyOneModerator &&
            !this.singleModeratorId &&
            eventType === 'joined' &&
            userRoles.has('moderator')) {
            this.singleModeratorId = user.id;
        }
        return this.allowOnlyOneModerator && this.singleModeratorId === user.id ||
            !this.allowOnlyOneModerator && userRoles.has('moderator');
    }
}
exports.ModeratorFilter = ModeratorFilter;
//# sourceMappingURL=moderatorFilter.js.map