"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.ENTITIES_PATHS = exports.MIGRATION_PATH = exports.MIGRATION_TABLE_NAME = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const microservices_1 = require("@nestjs/microservices");
const typeorm_1 = require("@nestjs/typeorm");
const config_service_1 = require("./config/config.service");
const path_1 = __importDefault(require("path"));
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const config_module_1 = require("./config/config.module");
exports.MIGRATION_TABLE_NAME = '__migrations';
exports.MIGRATION_PATH = path_1.default.join(__dirname + '/migrations/*.{ts,js}');
exports.ENTITIES_PATHS = [
    path_1.default.join(__dirname + '/**/*.entity.{ts,js}'),
];
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            microservices_1.ClientsModule.register([
                { name: 'ITEM_MICROSERVICE', transport: microservices_1.Transport.TCP },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.database.host,
                    ssl: config.database.ssl,
                    port: config.database.port,
                    username: config.database.user,
                    password: config.database.pass,
                    database: config.database.name,
                    autoLoadEntities: true,
                    migrationsTableName: exports.MIGRATION_TABLE_NAME,
                    migrations: [exports.MIGRATION_PATH],
                    entities: exports.ENTITIES_PATHS,
                    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
                    migrationsRun: true,
                    extra: {
                        connectionLimit: config.database.maxConnections,
                    },
                    logging: ['error'],
                }),
                inject: [config_service_1.ConfigService],
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map