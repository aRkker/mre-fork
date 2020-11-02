/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Material, MeshPrimitive } from '..';
/**
 * A MeshPrimitive prepopulated with a subdivided +Z-facing plane's vertices and triangles
 */
export declare class Plane extends MeshPrimitive {
    /**
     * Build quad geometry
     * @param width The size of the plane along the X axis
     * @param height The size of the plane along the Y axis
     * @param uSegments The number of subdivisions along the X axis
     * @param vSegments The number of subdivisions along the Y axis
     * @param material An initial material to apply to the plane
     */
    constructor(width: number, height: number, uSegments?: number, vSegments?: number, material?: Material);
}
//# sourceMappingURL=plane.d.ts.map