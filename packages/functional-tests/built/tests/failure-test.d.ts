/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Test } from '../test';
export default class FailureTest extends Test {
    expectedResultDescription: string;
    run(): Promise<boolean>;
}
