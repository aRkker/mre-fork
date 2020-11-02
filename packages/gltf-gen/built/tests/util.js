"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
/** @hidden */
function prettyPrintBuffer(buffer, offset) {
    const rawString = buffer.toString('hex', offset);
    let prettyString = '0000 | ';
    for (let i = 0; i < rawString.length; i++) {
        prettyString += rawString[i];
        if (i % 32 === 31) {
            const offsetString = ((i + 1) / 2).toString(16).padStart(4, '0');
            prettyString += `\n${offsetString} | `;
        }
        else if (i % 8 === 7) {
            prettyString += '  ';
        }
        else if (i % 2 === 1) {
            prettyString += ' ';
        }
    }
    console.log(prettyString + '\n');
}
exports.prettyPrintBuffer = prettyPrintBuffer;
//# sourceMappingURL=util.js.map