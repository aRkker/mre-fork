/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Color4, Vector2, Vector3, Vector4 } from '@microsoft/mixed-reality-extension-common';
import { VertexAttribute } from './vertexattributes';
declare type Attribute2 = Vector2 | [number, number];
declare type Attribute3 = Vector3 | [number, number, number];
declare type Attribute4 = Vector4 | [number, number, number, number];
declare type AttributeColor4 = Color4 | [number, number, number, number];
export interface VertexLike {
    position?: Attribute3;
    normal?: Attribute3;
    tangent?: Attribute4;
    texCoord0?: Attribute2;
    texCoord1?: Attribute2;
    color0?: AttributeColor4;
}
export declare class Vertex implements VertexLike {
    position: Vector3;
    normal: Vector3;
    tangent: Vector4;
    texCoord0: Vector2;
    texCoord1: Vector2;
    color0: Color4;
    constructor(init?: VertexLike);
    static positionAttribute: VertexAttribute;
    static normalAttribute: VertexAttribute;
    static tangentAttribute: VertexAttribute;
    static texCoordAttribute: VertexAttribute[];
    static colorAttribute: VertexAttribute;
}
export {};
//# sourceMappingURL=vertex.d.ts.map