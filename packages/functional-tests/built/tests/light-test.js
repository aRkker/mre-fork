"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class LightTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Different types of lights";
    }
    cleanup() {
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        // Create scene objects.
        const props = this.createProps(root);
        const sphere = this.createSphere(root);
        // Updates the label for the test stage.
        const updateLabel = (lightType) => {
            this.app.setOverrideText(`${lightType} Light Test`);
        };
        // Picks a random color.
        const randomColor = (minValue = 0.15) => {
            return new MRE.Color3(minValue + Math.random() * (1 - minValue), minValue + Math.random() * (1 - minValue), minValue + Math.random() * (1 - minValue));
        };
        // Animates the sphere along one side of the scene, with some randomness of final height, and
        // rotating to face the center of the space.
        const animateSide = async (dirX, dirZ, time) => {
            if (!this.stopped) {
                const position = new MRE.Vector3(dirX, 0.5 + 1.5 * Math.random(), dirZ);
                const rotation = MRE.Quaternion.LookAt(position, props['monkey'].transform.app.position, new MRE.Vector3(0, -Math.PI / 8, 0));
                sphere.light.color = randomColor();
                await MRE.Animation.AnimateTo(this.app.context, sphere, {
                    destination: { transform: { local: { position, rotation } } },
                    duration: time,
                    easing: MRE.AnimationEaseCurves.EaseInOutSine
                });
            }
        };
        // One loop of the sphere moving along each side of the scene.
        const animateAround = async (time) => {
            await animateSide(1, 0, time / 4);
            await animateSide(-1, 0, time / 4);
            await animateSide(-1, -2, time / 4);
            await animateSide(1, -2, time / 4);
        };
        while (!this.stopped) {
            // Spot Light
            updateLabel('Spot');
            sphere.light.copy({
                type: 'spot',
                spotAngle: Math.PI / 3,
                range: 10,
            });
            await animateAround(5);
            // Point Light
            updateLabel('Point');
            sphere.light.copy({
                type: 'point',
                range: 10,
            });
            await animateAround(5);
        }
        return true;
    }
    createProps(root) {
        const props = {};
        props['monkey'] = MRE.Actor.CreateFromGltf(this.assets, {
            uri: `${this.baseUrl}/monkey.glb`,
            actor: {
                parentId: root.id,
                transform: {
                    app: {
                        position: { y: 1, z: -1 },
                        rotation: { x: 0, y: 1, z: 0, w: 0 },
                    },
                    local: { scale: { x: 0.5, y: 0.5, z: 0.5 } }
                }
            }
        });
        const propWidth = 0.33;
        const propHeight = 0.33;
        const boxMesh = this.assets.createBoxMesh('box', propWidth, propHeight, propWidth);
        props['left-box'] = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                appearance: { meshId: boxMesh.id },
                transform: {
                    app: {
                        position: { x: 0.5, y: 0.65, z: -1 }
                    }
                }
            }
        });
        props['right-box'] = MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                appearance: { meshId: boxMesh.id },
                transform: {
                    app: {
                        position: { x: -0.5, y: 0.65, z: -1 }
                    }
                }
            }
        });
        return props;
    }
    createSphere(root) {
        return MRE.Actor.Create(this.app.context, {
            actor: {
                parentId: root.id,
                appearance: {
                    meshId: this.assets.createSphereMesh('sphere', 0.1).id
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                light: { type: 'spot', intensity: 5 } // Add a light component.
            }
        });
    }
}
exports.default = LightTest;
//# sourceMappingURL=light-test.js.map