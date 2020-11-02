"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const GltfGen = __importStar(require(".."));
/** @hidden */
class Triangle {
    constructor() {
        this.name = 'Triangle';
        this.shouldPrintJson = true;
        this.shouldPrintBuffer = true;
    }
    run() {
        const prim = new GltfGen.MeshPrimitive({
            vertices: [
                new GltfGen.Vertex({ position: [0, 0, 0], texCoord0: [0, 0] }),
                new GltfGen.Vertex({ position: [1, 0, 0], texCoord0: [1, 0] }),
                new GltfGen.Vertex({ position: [0, 1, 0], texCoord0: [0, 1] })
            ],
            triangles: [0, 1, 2]
        });
        return GltfGen.GltfFactory.FromSinglePrimitive(prim).generateGLTF();
    }
}
exports.default = Triangle;
//# sourceMappingURL=triangle.js.map