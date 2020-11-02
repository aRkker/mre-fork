"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const path_1 = require("path");
const fs_1 = require("fs");
const readFile = util_1.promisify(fs_1.readFile), writeFile = util_1.promisify(fs_1.writeFile), unlink = util_1.promisify(fs_1.unlink);
async function convertToDataUrl(filename) {
    const data = await readFile(filename);
    return 'data:application/octet-stream;base64,' + data.toString('base64');
}
/**
 * Load a glTF file, and merge all contained animations into one.
 */
async function main(args) {
    var _a;
    const filename = path_1.resolve(process.cwd(), args[args.length - 1]);
    let gltf;
    try {
        // load the original json
        const text = await readFile(filename, { encoding: 'utf8' });
        // parse as glTF
        gltf = JSON.parse(text);
    }
    catch (e) {
        console.error(`Could not parse glTF JSON from ${filename}`);
        process.exit(1);
    }
    // verify existence of animations
    const anims = gltf.animations;
    console.log(`glTF has ${(_a = anims) === null || _a === void 0 ? void 0 : _a.length} animations`);
    if (!anims || anims.length === 0) {
        return;
    }
    // rewrite animations
    const final = { channels: [], samplers: [] };
    for (const anim of anims) {
        const samplerOffset = final.samplers.length;
        final.samplers.push(...anim.samplers);
        for (const channel of anim.channels) {
            channel.sampler += samplerOffset;
            final.channels.push(channel);
        }
    }
    gltf.animations = [final];
    // pack binary into json
    const binFile = path_1.resolve(path_1.dirname(filename), gltf.buffers[0].uri);
    gltf.buffers[0].uri = await convertToDataUrl(binFile);
    await unlink(binFile);
    // write result back to file
    await writeFile(filename, JSON.stringify(gltf));
    console.log('Done');
}
main(process.argv);
//# sourceMappingURL=merge-animations.js.map