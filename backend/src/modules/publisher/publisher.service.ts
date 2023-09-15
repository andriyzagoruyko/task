import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

export enum GraphQLWebsocketEvents {
  TaskUpdated = 'TaskUpdated',
}

@Injectable()
export class PublisherService {
  private pubSob: PubSub = new PubSub();

  getAsyncIterator(
    triggers: GraphQLWebsocketEvents | GraphQLWebsocketEvents[],
  ) {
    return this.pubSob.asyncIterator(triggers);
  }

  publishEvent<TPayload>(trigger: string, payload: TPayload) {
    return this.pubSob.publish(trigger, payload);
  }
}
