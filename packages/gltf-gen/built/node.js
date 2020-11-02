"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mixed_reality_extension_common_1 = require("@microsoft/mixed-reality-extension-common");
const serializable_1 = require("./serializable");
class Node extends serializable_1.Serializable {
    constructor(init = {}) {
        super();
        this.translation = new mixed_reality_extension_common_1.Vector3(0, 0, 0);
        this.rotation = new mixed_reality_extension_common_1.Quaternion(0, 0, 0, 1);
        this.scale = new mixed_reality_extension_common_1.Vector3(1, 1, 1);
        this.children = [];
        this.name = init.name;
        this.mesh = init.mesh;
        this.translation = init.translation || this.translation;
        this.rotation = init.rotation || this.rotation;
        this.scale = init.scale || this.scale;
        this.matrix = init.matrix;
        this.children = init.children || this.children;
    }
    serialize(document, data) {
        if (this.cachedSerialId) {
            return this.cachedSerialId;
        }
        const node = {
            name: this.name,
            mesh: this.mesh ? this.mesh.serialize(document, data) : undefined,
            children: this.children.length ? this.children.map(n => n.serialize(document, data)) : undefined
        };
        if (this.matrix) {
            node.matrix = Array.from(this.matrix.asArray());
        }
        else {
            if (!this.translation.equals(mixed_reality_extension_common_1.Vector3.Zero())) {
                node.translation = this.translation.asArray();
            }
            if (!mixed_reality_extension_common_1.Quaternion.IsIdentity(this.rotation)) {
                node.rotation = this.rotation.asArray();
            }
            if (!this.scale.equals(mixed_reality_extension_common_1.Vector3.One())) {
                node.scale = this.scale.asArray();
            }
        }
        if (!document.nodes) {
            document.nodes = [];
        }
        document.nodes.push(node);
        return this.cachedSerialId = document.nodes.length - 1;
    }
    getByteSize(scanId) {
        if (this.scanList.includes(scanId)) {
            return 0;
        }
        else {
            this.scanList.push(scanId);
        }
        return (this.mesh !== undefined ? this.mesh.getByteSize(scanId) : 0)
            + this.children.reduce((acc, n) => acc + n.getByteSize(scanId), 0);
    }
}
exports.Node = Node;
//# sourceMappingURL=node.js.map