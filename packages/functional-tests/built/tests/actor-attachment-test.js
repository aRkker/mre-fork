"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
class ActorAttachmentTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Actors attaching to avatar points";
        //Limited subset of AttachmentPoints for testing
        this.attachments = [
            'head',
            'neck',
            'hips',
            'left-eye',
            'left-foot',
            'left-hand',
            'right-eye',
            'right-foot',
            'right-hand'
        ];
        //Incremented by clicking grey cube
        this.attachmentIndex = 0;
        //Switch to determine if attachments are fully destroyed and remade in between changing attachment points
        //The state is displayed by the color of the cube to the left of the attachment cycle button
        //True = Red Cube  = attachedCube is destroyed and re-created
        //False = Blue Cube = attachedCube is detached and attached without being destroyed
        //Currently these produce different results in the end transform of attachedCube
        this.reCreateCubeTest = true;
    }
    //Destroy if necessary and create oblong attachment cube
    createCubeAttachment() {
        if (this.attachedCube) {
            this.attachedCube.destroy();
        }
        const boxIndex = this.assets.assets.findIndex((asset) => {
            return asset.name === 'smallBox';
        });
        this.attachedCube = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'cube1',
                parentId: this.rootActor.id,
                appearance: {
                    meshId: boxIndex === -1 ?
                        this.assets.createBoxMesh('smallBox', 1, 1, 1).id :
                        this.assets.assets[boxIndex].id
                },
                transform: {
                    local: {
                        scale: { x: 2, y: 0.5, z: 0.5 }
                    }
                }
            }
        });
    }
    async run(root) {
        this.rootActor = root;
        this.assets = new MRE.AssetContainer(this.app.context);
        //Create Materials and actors
        this.redMat = this.assets.createMaterial('redBall', {
            color: MRE.Color3.Red()
        });
        this.blueMat = this.assets.createMaterial('blueBall', {
            color: MRE.Color3.Blue()
        });
        const boxIndex = this.assets.assets.findIndex((asset) => {
            return asset.name === 'smallBox';
        });
        const boxID = boxIndex === -1 ?
            this.assets.createBoxMesh('smallBox', 1, 1, 1).id :
            this.assets.assets[boxIndex].id;
        const buttonCube = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'cube1',
                parentId: this.rootActor.id,
                appearance: {
                    meshId: boxID
                },
                collider: { geometry: { shape: MRE.ColliderType.Box } },
                transform: {
                    local: {
                        position: { x: 0, y: .5 },
                        scale: { x: 0.5, y: 0.5, z: 0.5 }
                    }
                }
            }
        });
        const CreateCube = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'cube1',
                parentId: this.rootActor.id,
                appearance: {
                    meshId: boxID,
                    materialId: this.redMat.id
                },
                collider: { geometry: { shape: MRE.ColliderType.Box } },
                transform: {
                    local: {
                        position: { x: -1.0, y: .5 },
                        scale: { x: 0.5, y: 0.5, z: 0.5 }
                    }
                }
            }
        });
        //Set Behaviors:
        //createButtonBehavior switches the method of cycling attach points between re-attaching and re-creating
        //buttonBehavior cycles attachment point of the attachedCube and optionally destroys and re-creates the actor
        const buttonBehavior = buttonCube.setBehavior(MRE.ButtonBehavior);
        const createButtonBehavior = CreateCube.setBehavior(MRE.ButtonBehavior);
        const label = MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'label',
                parentId: root.id,
                transform: {
                    local: {
                        position: {
                            y: 1.5
                        }
                    }
                }, text: {
                    contents: this.attachments[this.attachmentIndex].toString(),
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.TopCenter,
                    color: MRE.Color3.White()
                }
            }
        });
        buttonBehavior.onClick(() => {
            this.attachmentIndex = (this.attachmentIndex + 1) % this.attachments.length;
            this.attachedCube.detach();
            if (this.reCreateCubeTest) {
                this.createCubeAttachment();
            }
            this.attachedCube.attach(this.user, this.attachments[this.attachmentIndex]);
            label.text.contents = this.attachments[this.attachmentIndex].toString();
        });
        createButtonBehavior.onClick(() => {
            this.reCreateCubeTest = !this.reCreateCubeTest;
            if (this.reCreateCubeTest) {
                CreateCube.appearance.materialId = this.redMat.id;
            }
            else {
                CreateCube.appearance.materialId = this.blueMat.id;
            }
        });
        //Starting state
        this.createCubeAttachment();
        this.attachedCube.attach(this.user.id, this.attachments[this.attachmentIndex]);
        await this.stoppedAsync();
        this.attachedCube.attach(MRE.ZeroGuid, 'none');
        this.assets.unload();
        return true;
    }
}
exports.default = ActorAttachmentTest;
//# sourceMappingURL=actor-attachment-test.js.map