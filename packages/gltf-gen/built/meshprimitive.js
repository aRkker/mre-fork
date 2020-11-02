"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
const util_1 = require("./util");
const vertex_1 = require("./vertex");
class MeshPrimitive {
    // eslint-disable-next-line default-param-last
    constructor(init = {}, instanceParent) {
        this.vertices = [];
        this.triangles = [];
        if (instanceParent) {
            this.instanceParent = instanceParent;
        }
        else {
            this.vertices = init.vertices || this.vertices;
            this.triangles = init.triangles || this.triangles;
        }
        this.material = init.material || this.material;
    }
    _updateAttributeUsage() {
        this.usesNormals = false;
        this.usesTangents = false;
        this.usesTexCoord0 = false;
        this.usesTexCoord1 = false;
        this.usesColor0 = false;
        for (const v of this.vertices) {
            this.usesNormals = this.usesNormals || v.normal !== undefined;
            this.usesTangents = this.usesTangents || v.tangent !== undefined;
            this.usesTexCoord0 = this.usesTexCoord0 || v.texCoord0 !== undefined;
            this.usesTexCoord1 = this.usesTexCoord1 || v.texCoord1 !== undefined;
            this.usesColor0 = this.usesColor0 || v.color0 !== undefined;
        }
    }
    getByteSize(scanId) {
        this._updateAttributeUsage();
        const indexSize = this.vertices.length <= 65535 ? 2 : 4;
        const posBufSize = util_1.roundUpToNextMultipleOf4(this.vertices.length * vertex_1.Vertex.positionAttribute.byteSize);
        const indexBufSize = util_1.roundUpToNextMultipleOf4(this.triangles.length * indexSize);
        let count = posBufSize + indexBufSize;
        if (this.usesNormals) {
            count += util_1.roundUpToNextMultipleOf4(this.vertices.length * vertex_1.Vertex.normalAttribute.byteSize);
        }
        if (this.usesTangents) {
            count += util_1.roundUpToNextMultipleOf4(this.vertices.length * vertex_1.Vertex.tangentAttribute.byteSize);
        }
        if (this.usesTexCoord0) {
            count += util_1.roundUpToNextMultipleOf4(this.vertices.length * vertex_1.Vertex.texCoordAttribute[0].byteSize);
        }
        if (this.usesTexCoord1) {
            count += util_1.roundUpToNextMultipleOf4(this.vertices.length * vertex_1.Vertex.texCoordAttribute[1].byteSize);
        }
        if (this.usesColor0) {
            count += util_1.roundUpToNextMultipleOf4(this.vertices.length * vertex_1.Vertex.colorAttribute.byteSize);
        }
        if (this.material !== undefined) {
            count += this.material.getByteSize(scanId);
        }
        return count;
    }
    serialize(document, data) {
        if (this.cachedSerialVal !== undefined) {
            return this.cachedSerialVal;
        }
        // just dupe the attribute accessors from the instance parent if one exists
        if (this.instanceParent) {
            const prim0 = Object.assign({}, this.instanceParent.serialize(document, data));
            prim0.material = this.material.serialize(document, data);
            return this.cachedSerialVal = prim0;
        }
        const prim = {
            attributes: {
                POSITION: this._serializeAttribute(vertex_1.Vertex.positionAttribute, document, data)
            },
            indices: this._serializeIndices(document, data)
        };
        if (this.usesNormals) {
            prim.attributes.NORMAL = this._serializeAttribute(vertex_1.Vertex.normalAttribute, document, data);
        }
        if (this.usesTangents) {
            prim.attributes.TANGENT = this._serializeAttribute(vertex_1.Vertex.tangentAttribute, document, data);
        }
        if (this.usesTexCoord0) {
            prim.attributes.TEXCOORD_0 = this._serializeAttribute(vertex_1.Vertex.texCoordAttribute[0], document, data);
        }
        if (this.usesTexCoord1) {
            prim.attributes.TEXCOORD_1 = this._serializeAttribute(vertex_1.Vertex.texCoordAttribute[1], document, data);
        }
        if (this.usesColor0) {
            prim.attributes.COLOR_0 = this._serializeAttribute(vertex_1.Vertex.colorAttribute, document, data);
        }
        if (this.material) {
            prim.material = this.material.serialize(document, data);
        }
        return this.cachedSerialVal = prim;
    }
    _serializeAttribute(attr, document, data) {
        var _a, _b;
        if (!document.bufferViews) {
            document.bufferViews = [];
        }
        if (!document.accessors) {
            document.accessors = [];
        }
        let lastBV;
        if (document.bufferViews.length) {
            lastBV = document.bufferViews[document.bufferViews.length - 1];
        }
        const bufferView = {
            buffer: 0,
            byteOffset: lastBV ? util_1.roundUpToNextMultipleOf4(lastBV.byteOffset + lastBV.byteLength) : 0,
            byteLength: attr.byteSize * this.vertices.length
        };
        const bufferViewData = data.slice(bufferView.byteOffset, bufferView.byteOffset + bufferView.byteLength);
        const accessor = {
            bufferView: document.bufferViews.length,
            componentType: attr.componentType,
            type: attr.multiType,
            count: this.vertices.length
        };
        // write vertex data
        for (let vi = 0; vi < this.vertices.length; vi++) {
            attr.writeToBuffer(this.vertices[vi], bufferViewData, vi * attr.byteSize);
        }
        // fill padding with zeros
        for (let i = util_1.roundUpToNextMultipleOf4(bufferView.byteOffset + bufferView.byteLength) - 1; i >= bufferView.byteOffset + bufferView.byteLength; i--) {
            data.writeUInt8(0, i);
        }
        accessor.min = (_a = attr.min) === null || _a === void 0 ? void 0 : _a.asArray();
        accessor.max = (_b = attr.max) === null || _b === void 0 ? void 0 : _b.asArray();
        document.bufferViews.push(bufferView);
        document.accessors.push(accessor);
        return document.accessors.length - 1;
    }
    _serializeIndices(document, data) {
        if (!document.bufferViews) {
            document.bufferViews = [];
        }
        if (!document.accessors) {
            document.accessors = [];
        }
        let lastBV;
        if (document.bufferViews.length > 0) {
            lastBV = document.bufferViews[document.bufferViews.length - 1];
        }
        const bufferView = {
            buffer: 0,
            byteOffset: lastBV ? util_1.roundUpToNextMultipleOf4(lastBV.byteOffset + lastBV.byteLength) : 0,
            byteLength: (this.vertices.length <= 65535 ? 2 : 4) * this.triangles.length
        };
        const bufferViewData = data.slice(bufferView.byteOffset, bufferView.byteOffset + bufferView.byteLength);
        const accessor = {
            bufferView: document.bufferViews.length,
            componentType: this.vertices.length <= 65535 ? enums_1.AccessorComponentType.UShort : enums_1.AccessorComponentType.UInt,
            type: enums_1.AccessorType.Scalar,
            count: this.triangles.length
        };
        if (this.vertices.length <= 65535) {
            for (let ti = 0; ti < this.triangles.length; ti++) {
                bufferViewData.writeUInt16LE(this.triangles[ti], 2 * ti);
            }
        }
        else {
            for (let ti = 0; ti < this.triangles.length; ti++) {
                bufferViewData.writeUInt32LE(this.triangles[ti], 4 * ti);
            }
        }
        // fill padding with zeros
        for (let i = util_1.roundUpToNextMultipleOf4(bufferView.byteOffset + bufferView.byteLength) - 1; i >= bufferView.byteOffset + bufferView.byteLength; i--) {
            data.writeUInt8(0, i);
        }
        document.bufferViews.push(bufferView);
        document.accessors.push(accessor);
        return document.accessors.length - 1;
    }
}
exports.MeshPrimitive = MeshPrimitive;
//# sourceMappingURL=meshprimitive.js.map