/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Material, MeshPrimitive } from '..';
/**
 * A MeshPrimitive prepopulated with box vertices and triangles
 */
export declare class Box extends MeshPrimitive {
    /**
     * Build a box geometry
     * @param width The size of the box along the X axis
     * @param height The size of the box along the Y axis
     * @param depth The size of the box along the Z axis
     * @param material An initial material to apply to the box
     */
    constructor(width: number, height: number, depth: number, material?: Material);
}
//# sourceMappingURL=box.d.ts.map