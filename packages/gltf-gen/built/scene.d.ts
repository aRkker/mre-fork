/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import GLTF from './gen/gltf';
import { Node } from './node';
import { Serializable } from './serializable';
export interface SceneLike {
    name?: string;
    nodes?: Node[];
}
export declare class Scene extends Serializable implements SceneLike {
    name: string;
    nodes: Node[];
    constructor(init?: SceneLike);
    serialize(document: GLTF.GlTf, data: Buffer): GLTF.GlTfId;
    getByteSize(scanId: number): number;
}
//# sourceMappingURL=scene.d.ts.map