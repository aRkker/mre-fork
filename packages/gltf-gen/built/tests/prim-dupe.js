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
class PrimDupeTest {
    constructor() {
        this.name = 'Instanced prims';
        this.shouldPrintBuffer = false;
        this.shouldPrintJson = true;
    }
    run() {
        const prim1 = new GltfGen.MeshPrimitive({
            vertices: [
                new GltfGen.Vertex({ position: [0, 0, 0] }),
                new GltfGen.Vertex({ position: [1, 0, 0] }),
                new GltfGen.Vertex({ position: [0, 1, 0] })
            ],
            triangles: [0, 1, 2],
            material: new GltfGen.Material({ name: 'red' })
        });
        const prim2 = new GltfGen.MeshPrimitive({
            material: new GltfGen.Material({ name: 'blue' })
        }, prim1);
        const factory = new GltfGen.GltfFactory([new GltfGen.Scene({
                nodes: [
                    new GltfGen.Node({
                        mesh: new GltfGen.Mesh({
                            primitives: [prim1]
                        })
                    }),
                    new GltfGen.Node({
                        mesh: new GltfGen.Mesh({
                            primitives: [prim2]
                        })
                    })
                ]
            })]);
        return factory.generateGLTF();
    }
}
exports.default = PrimDupeTest;
//# sourceMappingURL=prim-dupe.js.map