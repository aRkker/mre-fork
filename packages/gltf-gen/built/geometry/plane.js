"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const mixed_reality_extension_common_1 = require("@microsoft/mixed-reality-extension-common");
/**
 * A MeshPrimitive prepopulated with a subdivided +Z-facing plane's vertices and triangles
 */
class Plane extends __1.MeshPrimitive {
    /**
     * Build quad geometry
     * @param width The size of the plane along the X axis
     * @param height The size of the plane along the Y axis
     * @param uSegments The number of subdivisions along the X axis
     * @param vSegments The number of subdivisions along the Y axis
     * @param material An initial material to apply to the plane
     */
    constructor(width, height, uSegments = 10, vSegments = 10, material = null) {
        super({ material });
        const forward = mixed_reality_extension_common_1.Vector3.Forward();
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        for (let u = 0; u <= uSegments; u++) {
            const uFrac = u / uSegments;
            for (let v = 0; v <= vSegments; v++) {
                const vFrac = v / vSegments;
                // add a vertex
                this.vertices.push(new __1.Vertex({
                    position: new mixed_reality_extension_common_1.Vector3(-halfWidth + uFrac * width, halfHeight - vFrac * height, 0),
                    normal: forward,
                    texCoord0: new mixed_reality_extension_common_1.Vector2(uFrac, vFrac)
                }));
                if (u > 0 && v > 0) {
                    const io = this.vertices.length - 1;
                    // (vSegments - 1) verts per stripe
                    const topLeft = io - vSegments - 2;
                    const topRight = io - 1;
                    const bottomLeft = io - vSegments - 1;
                    const bottomRight = io;
                    this.triangles.push(topLeft, bottomLeft, bottomRight, topLeft, bottomRight, topRight);
                }
            }
        }
    }
}
exports.Plane = Plane;
//# sourceMappingURL=plane.js.map