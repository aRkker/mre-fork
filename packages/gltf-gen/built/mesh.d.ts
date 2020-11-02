/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import GLTF from './gen/gltf';
import { MeshPrimitive } from './meshprimitive';
import { Serializable } from './serializable';
export interface MeshLike {
    name?: string;
    primitives?: MeshPrimitive[];
}
export declare class Mesh extends Serializable implements MeshLike {
    name: string;
    primitives: MeshPrimitive[];
    constructor(init?: MeshLike);
    serialize(document: GLTF.GlTf, data: Buffer): GLTF.GlTfId;
    getByteSize(scanId: number): number;
}
//# sourceMappingURL=mesh.d.ts.map