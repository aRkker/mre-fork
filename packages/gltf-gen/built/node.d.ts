/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import { Matrix, Quaternion, Vector3 } from '@microsoft/mixed-reality-extension-common';
import GLTF from './gen/gltf';
import { Mesh } from './mesh';
import { Serializable } from './serializable';
export interface NodeLike {
    name?: string;
    mesh?: Mesh;
    translation?: Vector3;
    rotation?: Quaternion;
    scale?: Vector3;
    matrix?: Matrix;
    children?: Node[];
}
export declare class Node extends Serializable implements NodeLike {
    name: string;
    mesh: Mesh;
    translation: Vector3;
    rotation: Quaternion;
    scale: Vector3;
    matrix: Matrix;
    children: Node[];
    constructor(init?: NodeLike);
    serialize(document: GLTF.GlTf, data: Buffer): GLTF.GlTfId;
    getByteSize(scanId: number): number;
}
//# sourceMappingURL=node.d.ts.map