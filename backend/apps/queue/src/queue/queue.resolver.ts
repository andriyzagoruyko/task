import {
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { FileEntity } from 'apps/file/src/modules/file/entities/file.entity';

import { RecognitionTaskEntity } from './entities/recognition-task.entity';
import { RecognitionTaskService } from './services/recognition-task.service';
import {
  GraphQLPublisherService,
  GraphQLWebsocketEvents,
} from '../graphql-publisher/graphql-publisher.service';

@Resolver(() => RecognitionTaskEntity)
export class QueueResolver {
  constructor(
    private readonly recognitionTaskService: RecognitionTaskService,
    private readonly graphqlPublisherService: GraphQLPublisherService,
  ) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @ResolveField(() => RecognitionTaskEntity)
  task(@Parent() file: FileEntity) {
    return this.recognitionTaskService.findByFileId(file.id);
  }

  @Subscription(() => RecognitionTaskEntity)
  taskUpdated() {
    return this.graphqlPublisherService.getAsyncIterator(
      GraphQLWebsocketEvents.TaskUpdated,
    );
  }
}
