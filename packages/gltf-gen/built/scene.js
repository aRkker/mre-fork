"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const serializable_1 = require("./serializable");
class Scene extends serializable_1.Serializable {
    constructor(init = {}) {
        super();
        this.nodes = [];
        this.name = init.name;
        this.nodes = init.nodes || this.nodes;
    }
    serialize(document, data) {
        if (this.cachedSerialId) {
            return this.cachedSerialId;
        }
        const scene = {
            name: this.name,
            nodes: this.nodes.length ? this.nodes.map(n => n.serialize(document, data)) : undefined
        };
        if (!document.scenes) {
            document.scenes = [];
        }
        document.scenes.push(scene);
        return this.cachedSerialId = document.scenes.length - 1;
    }
    getByteSize(scanId) {
        if (this.scanList.includes(scanId)) {
            return 0;
        }
        else {
            this.scanList.push(scanId);
        }
        return this.nodes.reduce((acc, n) => acc + n.getByteSize(scanId), 0);
    }
}
exports.Scene = Scene;
//# sourceMappingURL=scene.js.map