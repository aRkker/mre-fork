/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import { Test } from '.';
/** @hidden */
export default class EmptyTest implements Test {
    name: string;
    shouldPrintJson: boolean;
    shouldPrintBuffer: boolean;
    run(): Buffer;
}
//# sourceMappingURL=empty.d.ts.map