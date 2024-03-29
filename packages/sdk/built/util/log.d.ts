/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
declare class Log {
    private loggers;
    enable(facility?: string, severity?: string): void;
    disable(facility?: string, severity?: string): void;
    enabled(facility?: string, severity?: string): boolean;
    private logger;
    debug(facility: string, formatter: any, ...args: any[]): void;
    warning(facility: string, formatter: any, ...args: any[]): void;
    error(facility: string, formatter: any, ...args: any[]): void;
    info(facility: string, formatter: any, ...args: any[]): void;
    verbose(facility: string, formatter: any, ...args: any[]): void;
    log(facility: string, severity: string, formatter: any, ...args: any[]): void;
    private area;
    private enableArea;
    private disableArea;
    private areaEnabled;
    private cleanupFacility;
    private cleanupSeverity;
    private checkInitialize;
}
export declare const log: Log;
export {};
//# sourceMappingURL=log.d.ts.map