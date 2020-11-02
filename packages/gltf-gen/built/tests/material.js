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
const mixed_reality_extension_common_1 = require("@microsoft/mixed-reality-extension-common");
const GltfGen = __importStar(require(".."));
/** @hidden */
class MaterialTest {
    constructor() {
        this.name = 'Material';
        this.shouldPrintJson = true;
        this.shouldPrintBuffer = false;
    }
    run() {
        const prim = new GltfGen.MeshPrimitive({
            vertices: [
                new GltfGen.Vertex({ position: [0, 0, 0], texCoord0: [0, 0] }),
                new GltfGen.Vertex({ position: [1, 0, 0], texCoord0: [1, 0] }),
                new GltfGen.Vertex({ position: [0, 1, 0], texCoord0: [0, 1] })
            ],
            triangles: [0, 1, 2],
            material: new GltfGen.Material({
                baseColorFactor: new mixed_reality_extension_common_1.Color4(1, 0, 0, 1),
                baseColorTexture: new GltfGen.Texture({
                    source: new GltfGen.Image({ uri: 'bunny.jpg' })
                })
            })
        });
        return GltfGen.GltfFactory.FromSinglePrimitive(prim).generateGLTF();
    }
}
exports.default = MaterialTest;
//# sourceMappingURL=material.js.map