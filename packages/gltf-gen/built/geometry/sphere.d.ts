/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Material, MeshPrimitive } from '..';
/**
 * A MeshPrimitive prepopulated with sphere vertices and triangles
 */
export declare class Sphere extends MeshPrimitive {
    /**
     * Generate a sphere mesh primitive
     * @param radius The radius of the generated sphere
     * @param longLines The number of polar vertex rings
     * @param latLines The number of equatorial vertex rings (not counting poles)
     * @param material An initial material to apply to the sphere
     */
    constructor(radius: number, longLines?: number, latLines?: number, material?: Material);
}
//# sourceMappingURL=sphere.d.ts.map