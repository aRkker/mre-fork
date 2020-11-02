"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mixed_reality_extension_common_1 = require("@microsoft/mixed-reality-extension-common");
const enums_1 = require("./enums");
const serializable_1 = require("./serializable");
class Material extends serializable_1.Serializable {
    constructor(init = {}) {
        super();
        this.baseColorTexCoord = 0;
        this.baseColorFactor = new mixed_reality_extension_common_1.Color4(1, 1, 1, 1);
        this.metallicRoughnessTexCoord = 0;
        this.metallicFactor = 1;
        this.roughnessFactor = 1;
        this.normalTexCoord = 0;
        this.normalTexScale = 1;
        this.occlusionTexCoord = 0;
        this.occlusionTexStrength = 1;
        this.emissiveTexCoord = 0;
        this.emissiveFactor = new mixed_reality_extension_common_1.Color3(0, 0, 0);
        this.alphaMode = enums_1.AlphaMode.Opaque;
        this.alphaCutoff = 0.5;
        this.doubleSided = false;
        this.name = init.name;
        this.baseColorTexture = init.baseColorTexture;
        this.baseColorTexCoord = init.baseColorTexCoord || this.baseColorTexCoord;
        this.baseColorFactor = init.baseColorFactor || this.baseColorFactor;
        this.metallicRoughnessTexture = init.metallicRoughnessTexture;
        this.metallicRoughnessTexCoord = init.metallicRoughnessTexCoord || this.metallicRoughnessTexCoord;
        this.metallicFactor = init.metallicFactor || this.metallicFactor;
        this.roughnessFactor = init.roughnessFactor || this.roughnessFactor;
        this.normalTexture = init.normalTexture;
        this.normalTexCoord = init.normalTexCoord || this.normalTexCoord;
        this.normalTexScale = init.normalTexScale || this.normalTexScale;
        this.occlusionTexture = init.occlusionTexture;
        this.occlusionTexCoord = init.occlusionTexCoord || this.occlusionTexCoord;
        this.occlusionTexStrength = init.occlusionTexStrength || this.occlusionTexStrength;
        this.emissiveTexture = init.emissiveTexture;
        this.emissiveTexCoord = init.emissiveTexCoord || this.emissiveTexCoord;
        this.emissiveFactor = init.emissiveFactor || this.emissiveFactor;
        this.alphaMode = init.alphaMode || this.alphaMode;
        this.alphaCutoff = init.alphaCutoff || this.alphaCutoff;
        this.doubleSided = init.doubleSided || this.doubleSided;
    }
    serialize(document, data) {
        if (this.cachedSerialId !== undefined) {
            return this.cachedSerialId;
        }
        const mat = {
            name: this.name,
            pbrMetallicRoughness: {
                baseColorFactor: this.baseColorFactor.asArray(),
                metallicFactor: this.metallicFactor,
                roughnessFactor: this.roughnessFactor
            }
        };
        const pbr = mat.pbrMetallicRoughness;
        if (this.name) {
            mat.name = this.name;
        }
        if (this.baseColorTexture) {
            pbr.baseColorTexture = {
                index: this.baseColorTexture.serialize(document, data)
            };
            if (this.baseColorTexCoord !== 0) {
                pbr.baseColorTexture.texCoord = this.baseColorTexCoord;
            }
        }
        if (this.metallicRoughnessTexture) {
            pbr.metallicRoughnessTexture = {
                index: this.metallicRoughnessTexture.serialize(document, data)
            };
            if (this.metallicRoughnessTexCoord !== 0) {
                pbr.metallicRoughnessTexture.texCoord = this.metallicRoughnessTexCoord;
            }
        }
        if (this.normalTexture) {
            mat.normalTexture = {
                index: this.normalTexture.serialize(document, data)
            };
            if (this.normalTexCoord !== 0) {
                mat.normalTexture.texCoord = this.normalTexCoord;
            }
            if (this.normalTexScale !== 1) {
                mat.normalTexture.scale = this.normalTexScale;
            }
        }
        if (this.occlusionTexture) {
            mat.occlusionTexture = {
                index: this.occlusionTexture.serialize(document, data)
            };
            if (this.occlusionTexCoord !== 0) {
                mat.occlusionTexture.texCoord = this.occlusionTexCoord;
            }
            if (this.occlusionTexStrength !== 1) {
                mat.occlusionTexture.strength = this.occlusionTexStrength;
            }
        }
        if (!this.emissiveFactor.equalsFloats(0, 0, 0)) {
            mat.emissiveFactor = this.emissiveFactor.asArray();
        }
        if (this.emissiveTexture) {
            mat.emissiveTexture = {
                index: this.emissiveTexture.serialize(document, data)
            };
            if (this.emissiveTexCoord !== 0) {
                mat.emissiveTexture.texCoord = this.emissiveTexCoord;
            }
        }
        if (this.alphaMode !== enums_1.AlphaMode.Opaque) {
            mat.alphaMode = this.alphaMode;
            mat.alphaCutoff = this.alphaCutoff;
        }
        if (!document.materials) {
            document.materials = [];
        }
        document.materials.push(mat);
        return this.cachedSerialId = document.materials.length - 1;
    }
    getByteSize(scanId) {
        if (this.scanList.includes(scanId)) {
            return 0;
        }
        else {
            this.scanList.push(scanId);
        }
        return [
            this.baseColorTexture,
            this.metallicRoughnessTexture,
            this.normalTexture,
            this.occlusionTexture,
            this.emissiveTexture
        ]
            .reduce((acc, t) => acc + (t ? t.getByteSize(scanId) : 0), 0);
    }
}
exports.Material = Material;
//# sourceMappingURL=material.js.map