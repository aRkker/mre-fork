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
class SingleEventFilter extends MRE.UserFilter {
    /** @inheritdoc */
    constructor(context) {
        super(context);
    }
    shouldForwardUserEvent(user) {
        var _a;
        const userEventOrSpaceId = (_a = user.properties['altspacevr-event-id'], (_a !== null && _a !== void 0 ? _a : user.properties['altspacevr-space-id']));
        if (!this.eventOrSpaceId && userEventOrSpaceId) {
            this.eventOrSpaceId = userEventOrSpaceId;
        }
        return this.eventOrSpaceId && userEventOrSpaceId === this.eventOrSpaceId;
    }
}
exports.SingleEventFilter = SingleEventFilter;
//# sourceMappingURL=singleEventFilter.js.map