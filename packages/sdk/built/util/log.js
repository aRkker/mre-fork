"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const debug_1 = __importDefault(require("debug"));
class Log {
    constructor() {
        this.loggers = {};
        this.checkInitialize = () => {
            this.enable('app');
            this.enable('client');
            const logging = process.env.MRE_LOGGING || '';
            if (logging && logging.length) {
                const parts = logging.split(',').map(s => s.trim());
                for (const part of parts) {
                    /* eslint-disable-next-line prefer-const */
                    let [facility, severity] = part.split(':').map(s => s.trim());
                    const disable = facility.startsWith('-');
                    facility = facility.replace(/^-/u, '');
                    if (disable) {
                        this.disable(facility, severity);
                    }
                    else {
                        this.enable(facility, severity);
                    }
                }
            }
            this.checkInitialize = () => { };
        };
    }
    enable(facility, severity) {
        const area = this.area(facility, severity);
        this.enableArea(area);
    }
    disable(facility, severity) {
        const area = this.area(facility, severity);
        this.disableArea(area);
    }
    enabled(facility, severity) {
        const area = this.area(facility, severity);
        return this.areaEnabled(area);
    }
    logger(facility, severity) {
        return this.loggers[this.area(facility, severity)];
    }
    debug(facility, formatter, ...args) {
        this.log(facility, 'debug', formatter, ...args);
    }
    warning(facility, formatter, ...args) {
        this.log(facility, 'warning', formatter, ...args);
    }
    error(facility, formatter, ...args) {
        this.log(facility, 'error', formatter, ...args);
    }
    info(facility, formatter, ...args) {
        this.log(facility, 'info', formatter, ...args);
    }
    verbose(facility, formatter, ...args) {
        this.log(facility, 'verbose', formatter, ...args);
    }
    log(facility, severity, formatter, ...args) {
        this.checkInitialize();
        if (formatter) {
            facility = this.cleanupFacility(facility);
            severity = this.cleanupSeverity(severity);
            const logger = this.logger(null, null) || this.logger(facility, null) || this.logger(facility, severity);
            if (logger) {
                logger(formatter, ...args);
            }
        }
    }
    area(facility, severity) {
        facility = this.cleanupFacility(facility);
        severity = this.cleanupSeverity(severity);
        let area = '';
        if (facility) {
            area = `${facility}`;
        }
        if (severity) {
            area = `${area}:${severity}`;
        }
        return area;
    }
    enableArea(area) {
        if (!this.loggers[area]) {
            this.loggers[area] = debug_1.default(area);
            const areas = Object.keys(this.loggers).join(',');
            debug_1.default.enable(areas);
        }
    }
    disableArea(area) {
        delete this.loggers[area];
        const areas = Object.keys(this.loggers).join(',');
        debug_1.default.enable(areas);
    }
    areaEnabled(area) {
        return !!this.loggers[area];
    }
    cleanupFacility(facility) {
        switch (facility) {
            case '': return null;
            default: return facility;
        }
    }
    cleanupSeverity(severity) {
        switch (severity) {
            case 'success': return 'info';
            case '': return null;
            default: return severity;
        }
    }
}
exports.log = new Log();
//# sourceMappingURL=log.js.map