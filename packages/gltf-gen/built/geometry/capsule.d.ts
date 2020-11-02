/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Material, MeshPrimitive } from '..';
/**
 * A MeshPrimitive prepopulated with capsule vertices and triangles
 */
export declare class Capsule extends MeshPrimitive {
    /**
     * Generate a new capsule geometry, long axis aligned to local Y.
     * @param radius The radius of the capsule.
     * @param height The height of the capsule including end caps. Must be at least 2 * radius.
     * @param longLines The number of polar vertex rings (running the length of the capsule).
     * @param latLines The number of equatorial vertex rings (not counting poles) per cap.
     * @param capUvFraction The amount of texture space the end caps should occupy.
     * @param material An initial material to apply to the capsule.
     */
    constructor(radius: number, height: number, longLines?: number, latLines?: number, capUvFraction?: number, material?: Material);
}
//# sourceMappingURL=capsule.d.ts.map