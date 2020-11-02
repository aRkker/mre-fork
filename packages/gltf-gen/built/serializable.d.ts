/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import GLTF from './gen/gltf';
/** @hidden */
export declare abstract class Serializable {
    protected cachedSerialId: GLTF.GlTfId;
    abstract serialize(document: GLTF.GlTf, buffer: Buffer): GLTF.GlTfId;
    protected scanList: number[];
    abstract getByteSize(scanId: number): number;
}
//# sourceMappingURL=serializable.d.ts.map