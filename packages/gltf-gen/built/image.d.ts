/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import GLTF from './gen/gltf';
import { Serializable } from './serializable';
export interface ImageLike {
    name?: string;
    uri?: string;
    embeddedFilePath?: string;
}
export declare class Image extends Serializable implements ImageLike {
    name: string;
    /**
     * A URI to a texture, resolved by the model consumer. Don't set alongside [[embeddedFilePath]].
     */
    uri: string;
    /**
     * A path to a local texture file, resolved during serialization and packed into the model.
     * Don't set alongside [[uri]].
     */
    embeddedFilePath: string;
    private embeddedFileSize;
    private manualMime;
    /**
     * The image's MIME type. If omitted, will be detected from file extension.
     */
    get mimeType(): string;
    set mimeType(type: string);
    constructor(init?: ImageLike);
    serialize(document: GLTF.GlTf, data: Buffer): GLTF.GlTfId;
    private _embedImage;
    getByteSize(scanId: number): number;
}
//# sourceMappingURL=image.d.ts.map