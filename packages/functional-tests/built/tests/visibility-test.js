"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class VisibilityTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Two rows of appearing cubes";
        this.columns = [];
        this.activeColumn = 0;
    }
    cleanup() {
        clearInterval(this.interval);
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        this.assets.createBoxMesh('box', 0.1, 0.1, 0.1);
        const rowRoot = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                transform: { local: { position: { x: -0.9, y: 1, z: -1 } } }
            }
        });
        let lastCol = rowRoot;
        for (let i = 0; i < 10; i++) {
            lastCol = this.createColumn(lastCol, i);
            this.columns.push(lastCol);
        }
        this.interval = setInterval(() => {
            const nextCol = (this.activeColumn + 1) % this.columns.length;
            this.columns[this.activeColumn].appearance.enabled = true;
            this.columns[nextCol].appearance.enabled = false;
            this.activeColumn = nextCol;
        }, 1000);
        await this.stoppedAsync();
        return true;
    }
    createColumn(parent, colNum, spacing = 0.15) {
        const top = MRE.Actor.Create(this.app.context, {
            actor: {
                name: `${colNum}-0`,
                parentId: parent.id,
                appearance: { meshId: this.assets.meshes[0].id },
                transform: { local: { position: { x: spacing } } }
            }
        });
        MRE.Actor.Create(this.app.context, {
            actor: {
                name: `${colNum}-1`,
                parentId: top.id,
                appearance: { meshId: this.assets.meshes[0].id },
                transform: { local: { position: { y: -spacing } } }
            }
        });
        return top;
    }
}
exports.default = VisibilityTest;
//# sourceMappingURL=visibility-test.js.map