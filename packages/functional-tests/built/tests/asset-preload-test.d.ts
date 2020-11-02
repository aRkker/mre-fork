/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Test } from '../test';
export default class AssetPreloadTest extends Test {
    expectedResultDescription: string;
    private assets;
    private state;
    private root;
    private head;
    private sphere;
    private monkeyPrefab;
    private monkeyMat;
    private uvgridMat;
    private uvgridTex;
    private static AssignMat;
    run(root: MRE.Actor): Promise<boolean>;
    private cycleState;
    private setup;
    private generateMaterial;
    cleanup(): void;
}
