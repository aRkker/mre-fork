/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
export declare const SuccessColor: MRE.Color3;
export declare const FailureColor: MRE.Color3;
export declare const NeutralColor: MRE.Color3;
export declare const BackgroundColor: MRE.Color3;
/**
 * Functional Test Application. Takes query arguments to the websocket connection
 * @param test - Initialize menu on a particular test
 * @param autostart - Start the test immediately on user join
 * @param nomenu - Do not spawn the controls
 */
export declare class App {
    private _context;
    private params;
    private baseUrl;
    assets: MRE.AssetContainer;
    private firstUser;
    private _connectedUsers;
    testResults: {
        [name: string]: boolean;
    };
    private activeTestName;
    private activeTestFactory;
    private activeTest;
    private runPromise;
    private contextLabel;
    private playPauseButton;
    private playPauseText;
    private runnerActors;
    private backgroundMaterial;
    private testRoot;
    private exclusiveUser;
    private exclusiveUserToggle;
    private exclusiveUserLabel;
    private readonly menu;
    get context(): MRE.Context;
    get connectedUsers(): Map<MRE.Guid, MRE.User>;
    constructor(_context: MRE.Context, params: MRE.ParameterSet, baseUrl: string);
    private userJoined;
    private userLeft;
    private runTest;
    private runTestHelper;
    private stopTest;
    setOverrideText(text: string, color?: MRE.Color3): void;
    private toggleExclusiveUser;
    private setupShared;
    private setupRunner;
}
