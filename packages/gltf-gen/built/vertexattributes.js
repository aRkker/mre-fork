"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/* eslint-disable max-classes-per-file */
const mixed_reality_extension_common_1 = require("@microsoft/mixed-reality-extension-common");
const enums_1 = require("./enums");
/** @hidden */
class VertexAttribute {
    constructor(c, m) {
        this.componentType = enums_1.AccessorComponentType.Float;
        this.multiType = enums_1.AccessorType.Scalar;
        this.compSize = -1;
        this.fullSize = -1;
        this.componentType = c;
        this.multiType = m;
    }
    get min() { return this._min; }
    get max() { return this._max; }
    get elementByteSize() {
        if (this.compSize >= 0) {
            return this.compSize;
        }
        else {
            return this.compSize = VertexAttribute._sizeof(this.componentType);
        }
    }
    get byteSize() {
        if (this.fullSize >= 0) {
            return this.fullSize;
        }
        else {
            return this.fullSize = VertexAttribute._sizeof(this.componentType, this.multiType);
        }
    }
    static _sizeof(compType, type = enums_1.AccessorType.Scalar) {
        let compSize;
        switch (compType) {
            case enums_1.AccessorComponentType.Byte:
            case enums_1.AccessorComponentType.UByte:
                compSize = 1;
                break;
            case enums_1.AccessorComponentType.Short:
            case enums_1.AccessorComponentType.UShort:
                compSize = 2;
                break;
            case enums_1.AccessorComponentType.UInt:
            case enums_1.AccessorComponentType.Float:
                compSize = 4;
                break;
            default:
                compSize = 1;
        }
        let count;
        switch (type) {
            case enums_1.AccessorType.Scalar:
                count = 1;
                break;
            case enums_1.AccessorType.Vec2:
                count = 2;
                break;
            case enums_1.AccessorType.Vec3:
                count = 3;
                break;
            case enums_1.AccessorType.Vec4:
                count = 4;
                break;
            case enums_1.AccessorType.Mat2:
                count = 4;
                break;
            case enums_1.AccessorType.Mat3:
                count = 9;
                break;
            case enums_1.AccessorType.Mat4:
                count = 16;
                break;
            default: count = 1;
        }
        return compSize * count;
    }
}
exports.VertexAttribute = VertexAttribute;
/** @hidden */
class PositionAttribute extends VertexAttribute {
    constructor() {
        super(enums_1.AccessorComponentType.Float, enums_1.AccessorType.Vec3);
        this.resetMinMax();
    }
    get min() { return this._min; }
    get max() { return this._max; }
    get attributeName() { return 'POSITION'; }
    resetMinMax() {
        this._min = new mixed_reality_extension_common_1.Vector3(Infinity, Infinity, Infinity);
        this._max = new mixed_reality_extension_common_1.Vector3(-Infinity, -Infinity, -Infinity);
    }
    writeToBuffer(v, buffer, offset) {
        buffer.writeFloatLE(v.position.x, offset + 0 * this.elementByteSize);
        buffer.writeFloatLE(v.position.y, offset + 1 * this.elementByteSize);
        buffer.writeFloatLE(v.position.z, offset + 2 * this.elementByteSize);
        this._min.minimizeInPlace(v.position);
        this._max.maximizeInPlace(v.position);
    }
}
exports.PositionAttribute = PositionAttribute;
/** @hidden */
class NormalAttribute extends VertexAttribute {
    get attributeName() { return 'NORMAL'; }
    constructor() {
        super(enums_1.AccessorComponentType.Float, enums_1.AccessorType.Vec3);
        this.resetMinMax();
    }
    resetMinMax() { }
    writeToBuffer(v, buffer, offset) {
        buffer.writeFloatLE(v.normal.x, offset + 0 * this.elementByteSize);
        buffer.writeFloatLE(v.normal.y, offset + 1 * this.elementByteSize);
        buffer.writeFloatLE(v.normal.z, offset + 2 * this.elementByteSize);
    }
}
exports.NormalAttribute = NormalAttribute;
/** @hidden */
class TangentAttribute extends VertexAttribute {
    get attributeName() { return 'TANGENT'; }
    constructor() {
        super(enums_1.AccessorComponentType.Float, enums_1.AccessorType.Vec4);
        this.resetMinMax();
    }
    resetMinMax() { }
    writeToBuffer(v, buffer, offset) {
        buffer.writeFloatLE(v.tangent.x, offset + 0 * this.elementByteSize);
        buffer.writeFloatLE(v.tangent.y, offset + 1 * this.elementByteSize);
        buffer.writeFloatLE(v.tangent.z, offset + 2 * this.elementByteSize);
        buffer.writeFloatLE(v.tangent.w, offset + 3 * this.elementByteSize);
    }
}
exports.TangentAttribute = TangentAttribute;
/** @hidden */
class TexCoordAttribute extends VertexAttribute {
    constructor(index) {
        super(enums_1.AccessorComponentType.Float, enums_1.AccessorType.Vec2);
        this.index = index;
        this.resetMinMax();
    }
    get attributeName() { return 'TEXCOORD_' + this.index; }
    resetMinMax() { }
    writeToBuffer(v, buffer, offset) {
        const vec = this.index === 1 ? v.texCoord1 : v.texCoord0;
        buffer.writeFloatLE(vec.x, offset + 0 * this.elementByteSize);
        buffer.writeFloatLE(vec.y, offset + 1 * this.elementByteSize);
    }
}
exports.TexCoordAttribute = TexCoordAttribute;
/** @hidden */
class ColorAttribute extends VertexAttribute {
    constructor(index) {
        super(enums_1.AccessorComponentType.UByte, enums_1.AccessorType.Vec4);
        this.index = index;
        this.resetMinMax();
    }
    get attributeName() { return 'COLOR_' + this.index; }
    resetMinMax() { }
    writeToBuffer(v, buffer, offset) {
        buffer.writeUInt8(Math.floor(v.color0.r * 255), offset + 0 * this.elementByteSize);
        buffer.writeUInt8(Math.floor(v.color0.g * 255), offset + 1 * this.elementByteSize);
        buffer.writeUInt8(Math.floor(v.color0.b * 255), offset + 2 * this.elementByteSize);
        buffer.writeUInt8(Math.floor(v.color0.a * 255), offset + 3 * this.elementByteSize);
    }
}
exports.ColorAttribute = ColorAttribute;
//# sourceMappingURL=vertexattributes.js.map