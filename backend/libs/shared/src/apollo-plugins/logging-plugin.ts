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
    requestContext: GraphQLRequestContext,
  ): Promise<GraphQLRequestListener> {
    const logger = new Logger(LoggingPlugin.name);
    if (requestContext.request.operationName !== 'IntrospectionQuery') {
      logger.log(
        `request query: ${requestContext.request.query || 'undefined'}`,
      );
    }
    return {
      async willSendResponse(
        requestContext: GraphQLRequestContextWillSendResponse<BaseContext>,
      ): Promise<void> {
        if (requestContext.request.operationName !== 'IntrospectionQuery') {
          if (!requestContext.errors) {
            logger.log(`response without any errors`);
          } else {
            const errors = requestContext.errors.concat();
            const responseErrors = requestContext.response.errors?.concat();
            if (errors && responseErrors) {
              for (let i = 0; i < errors.length; i++) {
                const result = { ...responseErrors[i], stack: errors[i].stack };
                if (result.extensions) {
                  delete result.extensions.exception;
                }
                if (
                  result.extensions &&
                  result.extensions.code !== 'INTERNAL_SERVER_ERROR'
                ) {
                  logger.warn(
                    `response with errors: ${util.inspect(result, {
                      depth: 4,
                    })}`,
                  );
                } else {
                  logger.error(
                    `response with errors: ${util.inspect(result, {
                      depth: 4,
                    })}`,
                  );
                }
              }
            }
          }
        }
      },
    };
  }
}
