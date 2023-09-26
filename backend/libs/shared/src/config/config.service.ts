import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import * as Joi from 'joi';

expand(config());

const CONFIG_SCHEMA = Joi.object({
  gatewayGraphQLUrl: Joi.string().required(),
  fileGraphQLUrl: Joi.string().required(),
  queueGraphQLUrl: Joi.string().required(),
  authGraphQLUrl: Joi.string().required(),
  gatewayHttpPort: Joi.number().integer().greater(0).required(),
  fileHttpPort: Joi.number().integer().greater(0).required(),
  queueHttpPort: Joi.number().integer().greater(0).required(),
  authHttpPort: Joi.number().integer().greater(0).required(),

  fileDatabase: Joi.object().keys({
    host: Joi.string().required(),
    port: Joi.number().required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
    name: Joi.string().required(),
    maxConnections: Joi.number().required(),
    ssl: Joi.boolean().required(),
  }),

  queueDatabase: Joi.object().keys({
    host: Joi.string().required(),
    port: Joi.number().required(),
    name: Joi.string().required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
  }),

  rabbitMq: Joi.object().keys({
    host: Joi.string().required(),
    port: Joi.number().required(),
    user: Joi.string().required(),
    pass: Joi.string().required(),
  }),

  jwt: Joi.object().keys({
    secret: Joi.string().required(),
    privateKey: Joi.string().required(),
  }),
});

@Injectable()
export class ConfigService {
  gatewayHttpPort = Number(process.env.APP_GATEWAY_HTTP_PORT) || 8080;
  fileHttpPort = Number(process.env.APP_FILE_HTTP_PORT) || 8081;
  queueHttpPort = Number(process.env.APP_QUEUE_HTTP_PORT) || 8082;
  authHttpPort = Number(process.env.APP_AUTH_HTTP_PORT) || 8083;

  gatewayGraphQLUrl =
    process.env.APP_GATEWAY_GRAPHQL_URL || 'http://localhost:8080/graphql';
  fileGraphQLUrl =
    process.env.APP_FILE_GRAPHQL_URL || 'http://localhost:8081/graphql';
  queueGraphQLUrl =
    process.env.APP_QUEUE_GRAPHQL_URL || 'http://localhost:8082/graphql';
  authGraphQLUrl =
    process.env.APP_QUEUE_GRAPHQL_URL || 'http://localhost:8083/graphql';

  fileDatabase = {
    host: process.env.APP_BACKEND_DB_HOST || 'backend-db',
    port: Number(process.env.APP_BACKEND_DB_PORT) || 3306,
    user: process.env.APP_BACKEND_DB_USER || 'app',
    pass: process.env.APP_BACKEND_DB_PASS || 'app',
    name: process.env.APP_BACKEND_DB_NAME || 'app',
    maxConnections: process.env.APP_BACKEND_MAX_CONNECTIONS || 2,
    ssl: false,
  };

  queueDatabase = {
    host: process.env.APP_QUEUE_DB_HOST || 'mongodb',
    port: Number(process.env.APP_QUEUE_DB_PORT) || 27017,
    name: process.env.APP_QUEUE_DB_NAME || 'app',
    user: process.env.APP_QUEUE_DB_USER || 'app',
    pass: process.env.APP_QUEUE_DB_PASS || 'app',
  };

  rabbitMq = {
    host: process.env.RABBITMQ_HOST || 'rabbitmq',
    port: process.env.RABBITMQ_PORT || 5672,
    user: process.env.RABBITMQ_USER || 'app',
    pass: process.env.RABBITMQ_PASS || 'app',
  };

  jwt = {
    secret: 'secret',
    privateKey: 'private_key',
  };
}

// This line ensures the configuration object matches the defined schema
Joi.assert(new ConfigService(), CONFIG_SCHEMA, 'Invalid configuration');
