/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import { Permissions } from '..';
import { Adapter } from '../internal';
/**
 * Sets up an HTTP server, and generates an MRE context for your app to use.
 */
export declare class WebHost {
    private _adapter;
    private _baseDir;
    private manifest;
    private _ready;
    get adapter(): Adapter;
    get baseDir(): string;
    /**
     * A promise that resolves when the HTTP server is listening.
     * Get the server reference from `webHost.adapter.server`.
     */
    get ready(): Promise<void>;
    private bufferMap;
    constructor(options?: {
        baseDir?: string;
        baseUrl?: string;
        port?: string | number;
        permissions?: Permissions[];
        optionalPermissions?: Permissions[];
    });
    private checkStaticBuffers;
    private serveStaticBuffers;
    private validateManifest;
    private serveManifestIfNeeded;
    /**
     * Serve arbitrary binary blobs from a URL
     * @param filename A unique string ID for the blob
     * @param blob A binary blob
     * @param contentType The MIME type that identifies this blob
     * @returns The URL to fetch the provided blob
     */
    registerStaticBuffer(filename: string, blob: Buffer, contentType?: string): string;
}
//# sourceMappingURL=webHost.d.ts.map