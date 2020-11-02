/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import { Material, Mesh, MeshPrimitive, Scene, Texture } from '.';
/**
 * Generates a glTF document from mesh data
 */
export declare class GltfFactory {
    textures: Texture[];
    materials: Material[];
    meshes: Mesh[];
    scenes: Scene[];
    constructor(scenes?: Scene[], meshes?: Mesh[], materials?: Material[], textures?: Texture[]);
    /**
     * @returns A buffer containing a glTF document in GLB format
     */
    generateGLTF(): Buffer;
    static FromSinglePrimitive(prim: MeshPrimitive): GltfFactory;
}
//# sourceMappingURL=gltffactory.d.ts.map