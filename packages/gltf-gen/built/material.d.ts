/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import { Color3, Color4 } from '@microsoft/mixed-reality-extension-common';
import { AlphaMode } from './enums';
import GLTF from './gen/gltf';
import { Serializable } from './serializable';
import { Texture } from './texture';
export interface MaterialLike {
    name?: string;
    baseColorTexture?: Texture;
    baseColorTexCoord?: number;
    baseColorFactor?: Color4;
    metallicRoughnessTexture?: Texture;
    metallicRoughnessTexCoord?: number;
    metallicFactor?: number;
    roughnessFactor?: number;
    normalTexture?: Texture;
    normalTexCoord?: number;
    normalTexScale?: number;
    occlusionTexture?: Texture;
    occlusionTexCoord?: number;
    occlusionTexStrength?: number;
    emissiveTexture?: Texture;
    emissiveTexCoord?: number;
    emissiveFactor?: Color3;
    alphaMode?: AlphaMode;
    alphaCutoff?: number;
    doubleSided?: boolean;
}
export declare class Material extends Serializable implements MaterialLike {
    name: string;
    baseColorTexture: Texture;
    baseColorTexCoord: number;
    baseColorFactor: Color4;
    metallicRoughnessTexture: Texture;
    metallicRoughnessTexCoord: number;
    metallicFactor: number;
    roughnessFactor: number;
    normalTexture: Texture;
    normalTexCoord: number;
    normalTexScale: number;
    occlusionTexture: Texture;
    occlusionTexCoord: number;
    occlusionTexStrength: number;
    emissiveTexture: Texture;
    emissiveTexCoord: number;
    emissiveFactor: Color3;
    alphaMode: AlphaMode;
    alphaCutoff: number;
    doubleSided: boolean;
    constructor(init?: MaterialLike);
    serialize(document: GLTF.GlTf, data: Buffer): GLTF.GlTfId;
    getByteSize(scanId: number): number;
}
//# sourceMappingURL=material.d.ts.map