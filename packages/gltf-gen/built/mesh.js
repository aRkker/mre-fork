"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const serializable_1 = require("./serializable");
class Mesh extends serializable_1.Serializable {
    constructor(init = {}) {
        super();
        this.primitives = [];
        this.name = init.name;
        this.primitives = init.primitives || this.primitives;
    }
    serialize(document, data) {
        if (this.cachedSerialId) {
            return this.cachedSerialId;
        }
        const mesh = {
            name: this.name,
            primitives: this.primitives.map(p => p.serialize(document, data))
        };
        if (!document.meshes) {
            document.meshes = [];
        }
        document.meshes.push(mesh);
        return this.cachedSerialId = document.meshes.length - 1;
    }
    getByteSize(scanId) {
        if (this.scanList.includes(scanId)) {
            return 0;
        }
        else {
            this.scanList.push(scanId);
        }
        return this.primitives.reduce((acc, p) => acc + p.getByteSize(scanId), 0);
    }
}
exports.Mesh = Mesh;
//# sourceMappingURL=mesh.js.map