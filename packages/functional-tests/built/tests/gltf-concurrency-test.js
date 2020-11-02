"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class GltfConcurrencyTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Cesium man, a bottle, and maybe a gearbox.";
        this.modsOnly = true;
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        let runnerAssets;
        let bottleAssets;
        let gearboxAssets;
        this.assets.loadGltf('https://raw.githubusercontent.com/' +
            'KhronosGroup/glTF-Sample-Models/master/2.0/GearboxAssy/glTF/GearboxAssy.gltf')
            .then(assets => gearboxAssets = assets)
            .catch(() => console.log('Gearbox didn\'t load, as expected in Altspace'));
        try {
            [runnerAssets, bottleAssets] = await Promise.all([
                this.assets.loadGltf('https://raw.githubusercontent.com/' +
                    'KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb'),
                this.assets.loadGltf('https://raw.githubusercontent.com/' +
                    'KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF/WaterBottle.gltf')
            ]);
        }
        catch (errs) {
            console.error(errs);
            return false;
        }
        const runner = MRE.Actor.CreateFromPrefab(this.app.context, {
            prefabId: runnerAssets.find(a => !!a.prefab).id,
            actor: {
                name: 'runner',
                parentId: root.id,
                transform: { local: { position: { x: 0.66, y: 0.0, z: -0.5 } } }
            }
        });
        runner.created().then(() => runner.targetingAnimationsByName.get('animation:0').play());
        if (gearboxAssets) {
            MRE.Actor.CreateFromPrefab(this.app.context, {
                prefabId: gearboxAssets.find(a => !!a.prefab).id,
                actor: {
                    name: 'gearbox',
                    parentId: root.id,
                    transform: { local: { position: { x: 16, y: 0.3, z: -1.5 }, scale: { x: 0.1, y: 0.1, z: 0.1 } } }
                }
            });
        }
        MRE.Actor.CreateFromPrefab(this.app.context, {
            prefabId: bottleAssets.find(a => !!a.prefab).id,
            actor: {
                name: 'bottle',
                parentId: root.id,
                transform: { local: { position: { x: -.66, y: 0.5, z: -1 }, scale: { x: 4, y: 4, z: 4 } } }
            }
        });
        await this.stoppedAsync();
        return true;
    }
    cleanup() {
        this.assets.unload();
    }
}
exports.default = GltfConcurrencyTest;
//# sourceMappingURL=gltf-concurrency-test.js.map