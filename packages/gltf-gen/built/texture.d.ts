/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import { Image } from '.';
import { TextureMagFilter, TextureMinFilter, TextureWrapMode } from './enums';
import GLTF from './gen/gltf';
import { Serializable } from './serializable';
export interface TextureLike {
    name?: string;
    source?: Image;
    magFilter?: TextureMagFilter;
    minFilter?: TextureMinFilter;
    wrapS?: TextureWrapMode;
    wrapT?: TextureWrapMode;
}
export declare class Texture extends Serializable implements TextureLike {
    name: string;
    source: Image;
    magFilter: TextureMagFilter;
    minFilter: TextureMinFilter;
    wrapS: TextureWrapMode;
    wrapT: TextureWrapMode;
    constructor(init?: TextureLike);
    serialize(document: GLTF.GlTf, data: Buffer): GLTF.GlTfId;
    private _serializeSampler;
    getByteSize(scanId: number): number;
}
//# sourceMappingURL=texture.d.ts.map