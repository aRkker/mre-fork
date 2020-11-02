/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { App } from './app';
import { TestFactory } from './test';
declare type SelectionHandler = (name: string, factory: TestFactory, user: MRE.User) => void;
export interface MenuItem {
    label: string;
    action: TestFactory | MenuItem[];
}
export declare class Menu {
    private app;
    private buttons;
    private behaviors;
    private labels;
    private successMat;
    private failureMat;
    private neutralMat;
    private buttonMesh;
    private breadcrumbs;
    private backActors;
    private handler;
    private get context();
    constructor(app: App);
    onSelection(handler: SelectionHandler): void;
    hide(): void;
    back(): void;
    show(): void;
    private setup;
    private destroy;
}
export {};
