"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const mime_types_1 = require("mime-types");
const serializable_1 = require("./serializable");
const util_1 = require("./util");
class Image extends serializable_1.Serializable {
    constructor(init = {}) {
        super();
        this.name = init.name;
        this.uri = init.uri;
        this.embeddedFilePath = init.embeddedFilePath;
    }
    /**
     * The image's MIME type. If omitted, will be detected from file extension.
     */
    get mimeType() {
        if (this.manualMime !== undefined) {
            return this.manualMime;
        }
        else if (this.embeddedFilePath !== undefined) {
            return mime_types_1.lookup(this.embeddedFilePath) || 'application/octet-stream';
        }
        else if (this.uri !== undefined) {
            return mime_types_1.lookup(this.uri) || 'application/octet-stream';
        }
    }
    set mimeType(type) {
        this.manualMime = type;
    }
    serialize(document, data) {
        if (this.cachedSerialId !== undefined) {
            return this.cachedSerialId;
        }
        const image = {
            name: this.name,
            uri: this.uri,
            mimeType: this.mimeType
        };
        if (this.embeddedFilePath) {
            image.bufferView = this._embedImage(document, data);
        }
        if (!document.images) {
            document.images = [];
        }
        document.images.push(image);
        return this.cachedSerialId = document.images.length - 1;
    }
    _embedImage(document, data) {
        let lastBV;
        if (document.bufferViews.length > 0) {
            lastBV = document.bufferViews[document.bufferViews.length - 1];
        }
        const bufferView = {
            buffer: 0,
            byteOffset: lastBV ? Math.ceil((lastBV.byteOffset + lastBV.byteLength) / 4) * 4 : 0,
            byteLength: this.embeddedFileSize
        };
        const bufferViewData = data.slice(bufferView.byteOffset, bufferView.byteOffset + bufferView.byteLength);
        // fill padding with zeros
        for (let i = util_1.roundUpToNextMultipleOf4(bufferView.byteOffset + bufferView.byteLength) - 1; i >= bufferView.byteOffset + bufferView.byteLength; i--) {
            data.writeUInt8(0, i);
        }
        fs_1.readFileSync(this.embeddedFilePath).copy(bufferViewData);
        if (!document.bufferViews) {
            document.bufferViews = [];
        }
        document.bufferViews.push(bufferView);
        return document.bufferViews.length - 1;
    }
    getByteSize(scanId) {
        if (this.scanList.includes(scanId)) {
            return 0;
        }
        else {
            this.scanList.push(scanId);
        }
        if (this.embeddedFilePath) {
            const stat = fs_1.statSync(this.embeddedFilePath);
            return this.embeddedFileSize = stat.size;
        }
        else {
            return 0;
        }
    }
}
exports.Image = Image;
//# sourceMappingURL=image.js.map