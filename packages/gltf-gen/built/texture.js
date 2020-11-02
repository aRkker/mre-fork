"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
const serializable_1 = require("./serializable");
class Texture extends serializable_1.Serializable {
    constructor(init = {}) {
        super();
        this.magFilter = enums_1.TextureMagFilter.Linear;
        this.minFilter = enums_1.TextureMinFilter.Linear;
        this.wrapS = enums_1.TextureWrapMode.Repeat;
        this.wrapT = enums_1.TextureWrapMode.Repeat;
        this.name = init.name;
        this.source = init.source;
        this.magFilter = init.magFilter || this.magFilter;
        this.minFilter = init.minFilter || this.minFilter;
        this.wrapS = init.wrapS || this.wrapS;
        this.wrapT = init.wrapT || this.wrapT;
    }
    serialize(document, data) {
        if (this.cachedSerialId !== undefined) {
            return this.cachedSerialId;
        }
        const texture = {
            name: this.name,
            source: this.source.serialize(document, data),
            sampler: this._serializeSampler(document, data)
        };
        if (!document.textures) {
            document.textures = [];
        }
        document.textures.push(texture);
        return this.cachedSerialId = document.textures.length - 1;
    }
    _serializeSampler(document, data) {
        // get existing sampler with the same settings
        const samplerId = document.samplers ? document.samplers.findIndex(s => s.wrapS === this.wrapS && s.wrapT === this.wrapT &&
            s.minFilter === this.minFilter && s.magFilter === this.magFilter)
            : -1;
        if (samplerId >= 0) {
            return samplerId;
        }
        const sampler = {
            wrapS: this.wrapS,
            wrapT: this.wrapT,
            minFilter: this.minFilter,
            magFilter: this.magFilter
        };
        if (!document.samplers) {
            document.samplers = [];
        }
        document.samplers.push(sampler);
        return document.samplers.length - 1;
    }
    getByteSize(scanId) {
        return this.source.getByteSize(scanId);
    }
}
exports.Texture = Texture;
//# sourceMappingURL=texture.js.map