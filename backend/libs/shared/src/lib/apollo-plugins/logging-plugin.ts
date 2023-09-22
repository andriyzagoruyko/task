import { Plugin } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import {
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
} from 'apollo-server-types';
import * as util from 'util';

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  async requestDidStart(
    context: GraphQLRequestContext,
  ): Promise<GraphQLRequestListener> {
    const logger = new Logger(LoggingPlugin.name);
    if (context.request.operationName !== 'IntrospectionQuery') {
      logger.log(`request query: ${context.request.query || 'undefined'}`);
    }
    return {
      async willSendResponse(
        requestContext: GraphQLRequestContextWillSendResponse<BaseContext>,
      ): Promise<void> {
        if (requestContext.request.operationName !== 'IntrospectionQuery') {
          if (!requestContext.errors) {
            logger.log(`response without any errors`);
            return;
          }

          const { errors } = requestContext;
          const responseErrors = requestContext.response.errors;

          if (errors) {
            logger.log(`Request errors:`);
            errors.forEach((err) => logger.error(err.toString()));
          }

          if (errors) {
            responseErrors?.forEach((err) => logger.error(err.toString()));
          }
        }
      },
    };
  }
}
