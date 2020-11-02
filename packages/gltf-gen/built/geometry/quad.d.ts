/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Material, MeshPrimitive } from '..';
/**
 * A MeshPrimitive prepopulated with a single +Z-facing quad's vertices and triangles
 */
export declare class Quad extends MeshPrimitive {
    /**
     * Build quad geometry
     * @param width The size of the quad along the X axis
     * @param height The size of the quad along the Y axis
     * @param material An initial material to apply to the quad
     */
    constructor(width: number, height: number, material?: Material);
}
//# sourceMappingURL=quad.d.ts.map