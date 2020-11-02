"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class StatsTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Shows the current server stats";
    }
    async run(root) {
        const stats = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'stats',
                parentId: root.id,
                transform: { local: { position: { y: 1, z: -1 } } },
                text: {
                    contents: this.prettyPrint(this.app.context.getStats()),
                    height: 0.08,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    justify: MRE.TextJustify.Left
                }
            }
        });
        const box = MRE.Actor.CreatePrimitive(new MRE.AssetContainer(this.app.context), {
            definition: {
                shape: MRE.PrimitiveShape.Box,
                dimensions: { x: 0.1, y: 0.1, z: 0.01 }
            },
            addCollider: true,
            actor: {
                name: 'refresh',
                parentId: root.id,
                transform: { local: { position: { x: 0.5, y: 1.5, z: -1 } } }
            }
        });
        MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'label',
                parentId: box.id,
                transform: { local: { position: { y: -0.1 } } },
                text: {
                    contents: 'Refresh',
                    height: 0.08,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    justify: MRE.TextJustify.Center
                }
            }
        });
        box.setBehavior(MRE.ButtonBehavior).onClick(() => {
            stats.text.contents = this.prettyPrint(this.app.context.getStats());
        });
        await this.stoppedAsync();
        return true;
    }
    prettyPrint(stats) {
        const plainStats = stats;
        let pp = '';
        for (const k in plainStats) {
            // eslint-disable-next-line no-prototype-builtins
            if (!plainStats.hasOwnProperty(k)) {
                continue;
            }
            const v = plainStats[k];
            if (Array.isArray(v)) {
                const arrayString = v
                    .map((n) => n.toLocaleString(undefined, { maximumFractionDigits: 3 }))
                    .join(' / ');
                pp += `${k}: ${arrayString}\n`;
            }
            else {
                pp += `${k}: ${v}\n`;
            }
        }
        return pp.trim();
    }
}
exports.default = StatsTest;
//# sourceMappingURL=stats-test.js.map