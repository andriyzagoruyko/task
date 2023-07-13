import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import * as Joi from 'joi';

expand(config());

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

  rabbitMq: Joi.object().keys({
    host: Joi.string().required(),
    port: Joi.number().required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
  }),
});

@Injectable()
export class ConfigService {
  httpPort = Number(process.env.APP_PORT) || 8080;

  database = {
    host: process.env.APP_BACKEND_DB_HOST || 'backend-db',
    port: Number(process.env.APP_BACKEND_DB_PORT) || 3306,
    user: process.env.APP_BACKEND_DB_USER || 'app',
    pass: process.env.APP_BACKEND_DB_PASS || 'app',
    name: process.env.APP_BACKEND_DB_NAME || 'app',
    maxConnections: process.env.APP_BACKEND_MAX_CONNECTIONS || 2,
    ssl: false,
  };

  rabbitMq = {
    host: process.env.RABBITMQ_HOST || 'rabbitmq',
    port: process.env.RABBITMQ_PORT || 5672,
    user: process.env.RABBITMQ_USER || 'app',
    pass: process.env.RABBITMQ_PASS || 'app',
  };
}

// This line ensures the configuration object matches the defined schema
Joi.assert(new ConfigService(), CONFIG_SCHEMA, 'Invalid configuration');
