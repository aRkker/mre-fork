"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TextureMagFilter;
(function (TextureMagFilter) {
    TextureMagFilter[TextureMagFilter["Nearest"] = 9728] = "Nearest";
    TextureMagFilter[TextureMagFilter["Linear"] = 9729] = "Linear";
})(TextureMagFilter = exports.TextureMagFilter || (exports.TextureMagFilter = {}));
var TextureMinFilter;
(function (TextureMinFilter) {
    TextureMinFilter[TextureMinFilter["Nearest"] = 9728] = "Nearest";
    TextureMinFilter[TextureMinFilter["Linear"] = 9729] = "Linear";
    TextureMinFilter[TextureMinFilter["NearestMipmapNearest"] = 9984] = "NearestMipmapNearest";
    TextureMinFilter[TextureMinFilter["LinearMipmapNearest"] = 9985] = "LinearMipmapNearest";
    TextureMinFilter[TextureMinFilter["NearestMipmapLinear"] = 9986] = "NearestMipmapLinear";
    TextureMinFilter[TextureMinFilter["LinearMipmapLinear"] = 9987] = "LinearMipmapLinear";
})(TextureMinFilter = exports.TextureMinFilter || (exports.TextureMinFilter = {}));
var TextureWrapMode;
(function (TextureWrapMode) {
    TextureWrapMode[TextureWrapMode["ClampToEdge"] = 33071] = "ClampToEdge";
    TextureWrapMode[TextureWrapMode["MirroredRepeat"] = 33648] = "MirroredRepeat";
    TextureWrapMode[TextureWrapMode["Repeat"] = 10497] = "Repeat";
})(TextureWrapMode = exports.TextureWrapMode || (exports.TextureWrapMode = {}));
var AlphaMode;
(function (AlphaMode) {
    AlphaMode["Opaque"] = "OPAQUE";
    AlphaMode["Mask"] = "MASK";
    AlphaMode["Blend"] = "BLEND";
})(AlphaMode = exports.AlphaMode || (exports.AlphaMode = {}));
var AccessorComponentType;
(function (AccessorComponentType) {
    AccessorComponentType[AccessorComponentType["Byte"] = 5120] = "Byte";
    AccessorComponentType[AccessorComponentType["UByte"] = 5121] = "UByte";
    AccessorComponentType[AccessorComponentType["Short"] = 5122] = "Short";
    AccessorComponentType[AccessorComponentType["UShort"] = 5123] = "UShort";
    AccessorComponentType[AccessorComponentType["UInt"] = 5125] = "UInt";
    AccessorComponentType[AccessorComponentType["Float"] = 5126] = "Float";
})(AccessorComponentType = exports.AccessorComponentType || (exports.AccessorComponentType = {}));
var AccessorType;
(function (AccessorType) {
    AccessorType["Scalar"] = "SCALAR";
    AccessorType["Vec2"] = "VEC2";
    AccessorType["Vec3"] = "VEC3";
    AccessorType["Vec4"] = "VEC4";
    AccessorType["Mat2"] = "MAT2";
    AccessorType["Mat3"] = "MAT3";
    AccessorType["Mat4"] = "MAT4";
})(AccessorType = exports.AccessorType || (exports.AccessorType = {}));
//# sourceMappingURL=enums.js.map