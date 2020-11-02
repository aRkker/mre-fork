"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class UserTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Lists user info";
    }
    async run(root) {
        const labelText = 'Launched by User Named: ' + this.user.name +
            '\nUser ID: ' + this.user.id +
            "\nPermissions: " + this.user.grantedPermissions.join(", ") +
            "\nProperties: " + this.formatProperties(this.user.properties) +
            "\nTotal Connected Users:" + this.app.context.users.length;
        MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                transform: {
                    local: {
                        position: { x: 0, y: 1, z: 0 }
                    }
                },
                text: {
                    contents: labelText,
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.MiddleCenter
                }
            }
        });
        await this.stoppedAsync();
        return true;
    }
    formatProperties(props) {
        let output = "";
        for (const k in props) {
            if (Object.prototype.hasOwnProperty.call(props, k)) {
                output += `\n   ${k}: ${props[k]}`;
            }
        }
        return output;
    }
}
exports.default = UserTest;
//# sourceMappingURL=user-test.js.map