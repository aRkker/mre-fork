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
class MeshPrimitive {
    constructor() {
        this.name = "MeshPrimitive";
        this.shouldPrintJson = true;
        this.shouldPrintBuffer = true;
    }
    run() {
        const vertices = [];
        const MAX_SHORT = 65535;
        // Add enough vertices so the triangles field needs integer sized
        // numbers to reference all of them
        for (let i = 0; i < MAX_SHORT + 2; i++) {
            const x = i / (MAX_SHORT + 1);
            vertices.push(new GltfGen.Vertex({ position: [x, x, x], texCoord0: [x, x] }));
        }
        const prim = new GltfGen.MeshPrimitive({
            vertices,
            // Reference the final vertex. This will throw an error if it trys
            // to write to an array of UShorts
            triangles: [0, 1, 2, 3, 4, MAX_SHORT + 1],
        });
        return GltfGen.GltfFactory.FromSinglePrimitive(prim).generateGLTF();
    }
}
exports.default = MeshPrimitive;
//# sourceMappingURL=meshprimitive.js.map