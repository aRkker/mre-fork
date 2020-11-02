"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class ReparentTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Sphere should be jumping left, center, and right";
    }
    cleanup() {
        clearInterval(this.interval);
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        const leftParent = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                transform: {
                    local: {
                        position: { x: -0.7, y: 0.3, z: -0.3 }
                    }
                }
            }
        });
        const rightParent = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                transform: {
                    local: {
                        position: { x: 0.7, y: 0.3, z: -0.3 }
                    }
                }
            }
        });
        const sphere = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: leftParent.id,
                appearance: {
                    meshId: this.assets.createSphereMesh('sphere', 0.25).id
                }
            }
        });
        let nextParent = 1;
        const parentIds = [leftParent.id, null, rightParent.id];
        this.interval = setInterval(() => {
            sphere.parentId = parentIds[nextParent];
            nextParent = (nextParent + 1) % parentIds.length;
        }, 1000);
        await this.stoppedAsync();
        return true;
    }
}
exports.default = ReparentTest;
//# sourceMappingURL=reparent-test.js.map