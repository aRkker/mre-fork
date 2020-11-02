/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import GLTF from './gen/gltf';
import { Material } from './material';
import { Vertex } from './vertex';
export interface MeshPrimitiveLike {
    vertices?: Vertex[];
    triangles?: number[];
    material?: Material;
}
export declare class MeshPrimitive implements MeshPrimitiveLike {
    vertices: Vertex[];
    triangles: number[];
    material: Material;
    private instanceParent;
    private usesNormals;
    private usesTangents;
    private usesTexCoord0;
    private usesTexCoord1;
    private usesColor0;
    constructor(init?: MeshPrimitiveLike, instanceParent?: MeshPrimitive);
    private _updateAttributeUsage;
    getByteSize(scanId: number): number;
    private cachedSerialVal;
    serialize(document: GLTF.GlTf, data: Buffer): GLTF.MeshPrimitive;
    private _serializeAttribute;
    private _serializeIndices;
}
//# sourceMappingURL=meshprimitive.d.ts.map