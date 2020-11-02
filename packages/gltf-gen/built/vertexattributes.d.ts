/// <reference types="node" />
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Vector2, Vector3, Vector4 } from '@microsoft/mixed-reality-extension-common';
import { AccessorComponentType, AccessorType } from './enums';
import { Vertex } from './vertex';
/** @hidden */
export declare abstract class VertexAttribute {
    componentType: AccessorComponentType;
    multiType: AccessorType;
    abstract get attributeName(): string;
    protected _min: Vector2 | Vector3 | Vector4;
    protected _max: Vector2 | Vector3 | Vector4;
    get min(): Vector2 | Vector3 | Vector4;
    get max(): Vector2 | Vector3 | Vector4;
    constructor(c: AccessorComponentType, m: AccessorType);
    abstract writeToBuffer(v: Vertex, buffer: Buffer, offset: number): void;
    abstract resetMinMax(): void;
    private compSize;
    get elementByteSize(): number;
    private fullSize;
    get byteSize(): number;
    private static _sizeof;
}
/** @hidden */
export declare class PositionAttribute extends VertexAttribute {
    protected _min: Vector3;
    protected _max: Vector3;
    get min(): Vector3;
    get max(): Vector3;
    get attributeName(): string;
    constructor();
    resetMinMax(): void;
    writeToBuffer(v: Vertex, buffer: Buffer, offset: number): void;
}
/** @hidden */
export declare class NormalAttribute extends VertexAttribute {
    get attributeName(): string;
    constructor();
    resetMinMax(): void;
    writeToBuffer(v: Vertex, buffer: Buffer, offset: number): void;
}
/** @hidden */
export declare class TangentAttribute extends VertexAttribute {
    get attributeName(): string;
    constructor();
    resetMinMax(): void;
    writeToBuffer(v: Vertex, buffer: Buffer, offset: number): void;
}
/** @hidden */
export declare class TexCoordAttribute extends VertexAttribute {
    private index;
    get attributeName(): string;
    constructor(index: number);
    resetMinMax(): void;
    writeToBuffer(v: Vertex, buffer: Buffer, offset: number): void;
}
/** @hidden */
export declare class ColorAttribute extends VertexAttribute {
    private index;
    get attributeName(): string;
    constructor(index: number);
    resetMinMax(): void;
    writeToBuffer(v: Vertex, buffer: Buffer, offset: number): void;
}
//# sourceMappingURL=vertexattributes.d.ts.map