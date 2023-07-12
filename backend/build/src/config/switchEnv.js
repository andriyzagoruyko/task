"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchEnv = void 0;
function switchEnv(cases, defaultVal) {
    if (!process.env.NODE_ENV) {
        throw new Error('NODE_ENV is required');
    }
    if (Object.prototype.hasOwnProperty.call(cases, process.env.NODE_ENV)) {
        return cases[process.env.NODE_ENV];
    }
    return defaultVal;
}
exports.switchEnv = switchEnv;
//# sourceMappingURL=switchEnv.js.map