"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const mixed_reality_extension_common_1 = require("@microsoft/mixed-reality-extension-common");
/**
 * A MeshPrimitive prepopulated with a single +Z-facing quad's vertices and triangles
 */
class Quad extends __1.MeshPrimitive {
    /**
     * Build quad geometry
     * @param width The size of the quad along the X axis
     * @param height The size of the quad along the Y axis
     * @param material An initial material to apply to the quad
     */
    constructor(width, height, material = null) {
        super({ material });
        // make geo corners
        const extent = new mixed_reality_extension_common_1.Vector3(width / 2, height / 2, 0);
        const pxpy = extent.clone();
        const pxny = extent.multiplyByFloats(1, -1, 1);
        const nxpy = extent.multiplyByFloats(-1, 1, 1);
        const nxny = extent.multiplyByFloats(-1, -1, 1);
        // make normal vectors
        const forward = mixed_reality_extension_common_1.Vector3.Forward();
        // make UV corners
        const uvTopLeft = new mixed_reality_extension_common_1.Vector2(0, 0);
        const uvTopRight = new mixed_reality_extension_common_1.Vector2(1, 0);
        const uvBottomLeft = new mixed_reality_extension_common_1.Vector2(0, 1);
        const uvBottomRight = new mixed_reality_extension_common_1.Vector2(1, 1);
        // make forward face
        this.vertices.push(new __1.Vertex({ position: nxpy, normal: forward, texCoord0: uvTopLeft }), new __1.Vertex({ position: pxpy, normal: forward, texCoord0: uvTopRight }), new __1.Vertex({ position: nxny, normal: forward, texCoord0: uvBottomLeft }), new __1.Vertex({ position: pxny, normal: forward, texCoord0: uvBottomRight }));
        this.triangles.push(1, 0, 3, 0, 2, 3);
    }
}
exports.Quad = Quad;
//# sourceMappingURL=quad.js.map