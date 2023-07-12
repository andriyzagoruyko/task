"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const dotenv_1 = require("dotenv");
const dotenv_expand_1 = require("dotenv-expand");
const Joi = require('joi');
(0, dotenv_expand_1.expand)((0, dotenv_1.config)());
const CONFIG_SCHEMA = Joi.object({
    httpPort: Joi.number().integer().greater(0).required(),
    database: Joi.object().keys({
        host: Joi.string().required(),
        port: Joi.number().required(),
        user: Joi.string().required(),
        pass: Joi.string().required(),
        name: Joi.string().required(),
        maxConnections: Joi.number().required(),
        ssl: Joi.boolean().required(),
    }),
});
let ConfigService = exports.ConfigService = class ConfigService {
    constructor() {
        this.httpPort = Number(process.env.APP_PORT) || 8081;
        this.database = {
            host: process.env.APP_BACKEND_DB_HOST || 'backend-db',
            port: Number(process.env.APP_BACKEND_DB_PORT) || 3306,
            user: process.env.APP_BACKEND_DB_USER || 'app',
            pass: process.env.APP_BACKEND_DB_PASS || 'app',
            name: process.env.APP_BACKEND_DB_NAME || 'app',
            maxConnections: process.env.APP_BACKEND_MAX_CONNECTIONS || 2,
            ssl: false,
        };
    }
};
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)()
], ConfigService);
Joi.assert(new ConfigService(), CONFIG_SCHEMA, 'Invalid configuration');
//# sourceMappingURL=config.service.js.map