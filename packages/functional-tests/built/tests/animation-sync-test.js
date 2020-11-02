"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MRE = tslib_1.__importStar(require("@microsoft/mixed-reality-extension-sdk"));
const test_1 = require("../test");
function GenerateSpinData(duration, repetitions) {
    const spinDuration = duration / repetitions;
    const frames = [];
    for (let rep = 0; rep < repetitions; rep++) {
        frames.push({
            time: spinDuration * (rep),
            value: MRE.Quaternion.FromEulerAngles(0, 0, 0)
        }, {
            time: spinDuration * (rep + 1 / 3),
            value: MRE.Quaternion.FromEulerAngles(0, 2 * Math.PI / 3, 0)
        }, {
            time: spinDuration * (rep + 2 / 3),
            value: MRE.Quaternion.FromEulerAngles(0, 4 * Math.PI / 3, 0)
        });
    }
    frames.push({
        time: duration,
        value: MRE.Quaternion.FromEulerAngles(0, 2 * Math.PI * (repetitions % 1), 0)
    });
    return frames;
}
const ClockAnimData = {
    tracks: [{
            target: MRE.ActorPath("bigHand").transform.local.rotation,
            keyframes: GenerateSpinData(60, 1),
            easing: MRE.AnimationEaseCurves.Linear
        }, {
            target: MRE.ActorPath("littleHand").transform.local.rotation,
            keyframes: GenerateSpinData(60, 60),
            easing: MRE.AnimationEaseCurves.Linear
        }]
};
class AnimationSyncTest extends test_1.Test {
    constructor() {
        super(...arguments);
        this.expectedResultDescription = "Tweak an animation";
    }
    cleanup() {
        this.assets.unload();
    }
    async run(root) {
        this.assets = new MRE.AssetContainer(this.app.context);
        const clockAssets = await this.assets.loadGltf(`${this.baseUrl}/clock.gltf`, 'box');
        const nativeClock = MRE.Actor.CreateFromPrefab(this.app.context, {
            firstPrefabFrom: clockAssets,
            actor: {
                name: "nativeClock",
                parentId: root.id,
                transform: {
                    local: {
                        position: { x: -0.6, y: 0.5, z: -1 },
                        rotation: MRE.Quaternion.FromEulerAngles(Math.PI / 2, Math.PI, 0),
                        scale: { x: 0.5, y: 0.5, z: 0.5 }
                    }
                }
            }
        });
        MRE.Actor.Create(this.app.context, { actor: {
                name: "label",
                parentId: nativeClock.id,
                transform: {
                    local: {
                        position: { x: 0.8 },
                        rotation: MRE.Quaternion.FromEulerAngles(Math.PI / 2, 0, -Math.PI / 2)
                    }
                },
                text: {
                    contents: "Native",
                    height: 0.2,
                    anchor: MRE.TextAnchorLocation.MiddleCenter
                }
            } });
        const mreClock = MRE.Actor.CreateFromPrefab(this.app.context, {
            firstPrefabFrom: clockAssets,
            actor: {
                name: "mreClock",
                parentId: root.id,
                transform: {
                    local: {
                        position: { x: -0.6, y: 1.2, z: -1 },
                        rotation: MRE.Quaternion.FromEulerAngles(Math.PI / 2, Math.PI, 0),
                        scale: { x: 0.5, y: 0.5, z: 0.5 }
                    }
                }
            }
        });
        MRE.Actor.Create(this.app.context, { actor: {
                name: "label",
                parentId: mreClock.id,
                transform: {
                    local: {
                        position: { x: 0.8 },
                        rotation: MRE.Quaternion.FromEulerAngles(Math.PI / 2, 0, -Math.PI / 2)
                    }
                },
                text: {
                    contents: "MRE",
                    height: 0.2,
                    anchor: MRE.TextAnchorLocation.MiddleCenter
                }
            } });
        await Promise.all([mreClock.created(), nativeClock.created()]);
        const anims = [
            nativeClock.targetingAnimationsByName.get("animation:0"),
            await this.animateClock(mreClock)
        ];
        const controls = [
            { label: "Playing", realtime: true, action: incr => {
                    if (incr !== 0) {
                        for (const a of anims) {
                            a.isPlaying = !a.isPlaying;
                        }
                    }
                    return anims[0].isPlaying.toString();
                } },
            { label: "Time", realtime: true, action: incr => {
                    if (incr > 0) {
                        for (const a of anims) {
                            a.time += 1;
                        }
                    }
                    else if (incr < 0) {
                        for (const a of anims) {
                            a.time -= 1;
                        }
                    }
                    return anims[0].time.toFixed(3);
                } },
            { label: "Speed", action: incr => {
                    if (incr > 0) {
                        for (const a of anims) {
                            a.speed += 0.25;
                        }
                    }
                    else if (incr < 0) {
                        for (const a of anims) {
                            a.speed -= 0.25;
                        }
                    }
                    return Math.floor(anims[0].speed * 100) + "%";
                } },
            { label: "Wrap", action: incr => {
                    const modes = Object.values(MRE.AnimationWrapMode);
                    const curModeIndex = modes.findIndex(m => m === anims[0].wrapMode);
                    const newModeIndex = (curModeIndex + incr + modes.length) % modes.length;
                    for (const a of anims) {
                        a.wrapMode = modes[newModeIndex];
                    }
                    return modes[newModeIndex];
                } }
        ];
        this.createControls(controls, MRE.Actor.Create(this.app.context, {
            actor: {
                name: 'controlsParent',
                parentId: root.id,
                transform: { local: { position: { x: 0.6, y: 1, z: -1 } } }
            }
        }));
        Promise.all(anims.map(a => a.finished())).then(() => this.app.setOverrideText('finished'));
        await this.stoppedAsync();
        return true;
    }
    createControls(controls, parent) {
        const arrowMesh = this.assets.createCylinderMesh('arrow', 0.01, 0.08, 'z', 3);
        const layout = new MRE.PlanarGridLayout(parent);
        let i = 0;
        const realtimeLabels = [];
        for (const controlDef of controls) {
            let label, more, less;
            layout.addCell({
                row: i,
                column: 1,
                width: 0.3,
                height: 0.25,
                contents: label = MRE.Actor.Create(this.app.context, { actor: {
                        name: `${controlDef.label}-label`,
                        parentId: parent.id,
                        text: {
                            contents: `${controlDef.label}:\n${controlDef.action(0)}`,
                            height: 0.1,
                            anchor: MRE.TextAnchorLocation.MiddleCenter,
                            justify: MRE.TextJustify.Center,
                            color: MRE.Color3.FromInts(255, 200, 255)
                        }
                    } })
            });
            controlDef.labelActor = label;
            layout.addCell({
                row: i,
                column: 0,
                width: 0.3,
                height: 0.25,
                contents: less = MRE.Actor.Create(this.app.context, { actor: {
                        name: `${controlDef.label}-less`,
                        parentId: parent.id,
                        appearance: { meshId: arrowMesh.id },
                        collider: { geometry: { shape: MRE.ColliderType.Auto } },
                        transform: { local: { rotation: MRE.Quaternion.FromEulerAngles(0, 0, Math.PI * 1.5) } }
                    } })
            });
            layout.addCell({
                row: i,
                column: 2,
                width: 0.3,
                height: 0.25,
                contents: more = MRE.Actor.Create(this.app.context, {
                    actor: {
                        name: `${controlDef.label}-more`,
                        parentId: parent.id,
                        appearance: { meshId: arrowMesh.id },
                        collider: { geometry: { shape: MRE.ColliderType.Auto } },
                        transform: { local: { rotation: MRE.Quaternion.FromEulerAngles(0, 0, Math.PI * 0.5) } }
                    }
                })
            });
            if (controlDef.realtime) {
                realtimeLabels.push(controlDef);
            }
            less.setBehavior(MRE.ButtonBehavior).onClick(() => {
                label.text.contents = `${controlDef.label}:\n${controlDef.action(-1)}`;
                for (const rt of realtimeLabels) {
                    rt.labelActor.text.contents = `${rt.label}:\n${rt.action(0)}`;
                }
            });
            more.setBehavior(MRE.ButtonBehavior).onClick(() => {
                label.text.contents = `${controlDef.label}:\n${controlDef.action(1)}`;
                for (const rt of realtimeLabels) {
                    rt.labelActor.text.contents = `${rt.label}:\n${rt.action(0)}`;
                }
            });
            i++;
        }
        layout.applyLayout();
        setInterval(() => {
            for (const rt of realtimeLabels) {
                rt.labelActor.text.contents = `${rt.label}:\n${rt.action(0)}`;
            }
        }, 250);
    }
    animateClock(gltf) {
        const clock = gltf.children.find(c => c.name === "Clock");
        const bigHand = clock.children.find(c => c.name === "BigHand");
        // const bigHandMat = bigHand.appearance.material;
        const littleHand = clock.children.find(c => c.name === "LittleHand");
        // const littleHandMat = littleHand.appearance.material;
        const animData = this.assets.createAnimationData("ClockSpin", ClockAnimData);
        return animData.bind({ bigHand, littleHand }, { wrapMode: MRE.AnimationWrapMode.Loop });
    }
}
exports.default = AnimationSyncTest;
//# sourceMappingURL=animation-sync-test.js.map