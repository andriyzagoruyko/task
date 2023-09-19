import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ConfigModule } from '@app/shared/config/config.module';
import { ConfigService } from '@app/shared/config/config.service';

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (config: ConfigService) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              //{ name: 'file', url: config.fileGraphQLUrl },
              { name: 'queue', url: config.queueGraphQLUrl },
            ],
          }),
        },
        server: {},
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class GatewayModule {}
