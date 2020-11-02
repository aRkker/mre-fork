"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mixed_reality_extension_common_1 = require("@microsoft/mixed-reality-extension-common");
const vertexattributes_1 = require("./vertexattributes");
class Vertex {
    constructor(init = {}) {
        if (init.position) {
            this.position = init.position instanceof mixed_reality_extension_common_1.Vector3 ?
                init.position :
                new mixed_reality_extension_common_1.Vector3(init.position[0], init.position[1], init.position[2]);
        }
        if (init.normal) {
            this.normal = init.normal instanceof mixed_reality_extension_common_1.Vector3 ?
                init.normal :
                new mixed_reality_extension_common_1.Vector3(init.normal[0], init.normal[1], init.normal[2]);
        }
        if (init.tangent) {
            this.tangent = init.tangent instanceof mixed_reality_extension_common_1.Vector4 ?
                init.tangent :
                new mixed_reality_extension_common_1.Vector4(init.tangent[0], init.tangent[1], init.tangent[2], init.tangent[3]);
        }
        if (init.texCoord0) {
            this.texCoord0 = init.texCoord0 instanceof mixed_reality_extension_common_1.Vector2 ?
                init.texCoord0 :
                new mixed_reality_extension_common_1.Vector2(init.texCoord0[0], init.texCoord0[1]);
        }
        if (init.texCoord1) {
            this.texCoord1 = init.texCoord1 instanceof mixed_reality_extension_common_1.Vector2 ?
                init.texCoord1 :
                new mixed_reality_extension_common_1.Vector2(init.texCoord1[0], init.texCoord1[1]);
        }
        if (init.color0) {
            this.color0 = init.color0 instanceof mixed_reality_extension_common_1.Color4 ?
                init.color0 :
                new mixed_reality_extension_common_1.Color4(init.color0[0], init.color0[1], init.color0[2], init.color0[3]);
        }
    }
}
exports.Vertex = Vertex;
Vertex.positionAttribute = new vertexattributes_1.PositionAttribute();
Vertex.normalAttribute = new vertexattributes_1.NormalAttribute();
Vertex.tangentAttribute = new vertexattributes_1.TangentAttribute();
Vertex.texCoordAttribute = [
    new vertexattributes_1.TexCoordAttribute(0),
    new vertexattributes_1.TexCoordAttribute(1)
];
Vertex.colorAttribute = new vertexattributes_1.ColorAttribute(0);
//# sourceMappingURL=vertex.js.map