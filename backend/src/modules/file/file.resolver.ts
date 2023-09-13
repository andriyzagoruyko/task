import {
  Resolver,
  Query,
  Args,
  ID,
  Mutation,
  Parent,
  ResolveField,
  Subscription,
} from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileEntity } from './entities/file.entity';
import { EnqueueFileInput } from './dto/enqueue-file.input';
import { StatsDto } from './dto/stats.dto';
import { RecognitionTaskEntity } from '../queue/entities/recognition-task.entity';
import { RecognitionTaskService } from '../queue/services/recognition-task.service';
import { PubSub } from 'graphql-subscriptions';
const pubSub = new PubSub();

@Resolver(() => FileEntity)
export class FileResolver {
  constructor(
    private readonly fileService: FileService,
    private readonly recognitionTaskService: RecognitionTaskService,
  ) {}

  @Query(() => [FileEntity])
  allFiles() {
    return this.fileService.findAll();
  }

  @Query(() => FileEntity)
  file(@Args('id', { type: () => ID }) id: number) {
    return this.fileService.findOne(id);
  }

  @Mutation(() => FileEntity)
  enqueueFile(@Args('enqueueFileInput') enqueueFileInput: EnqueueFileInput) {
    return this.fileService.enqueueFile(enqueueFileInput);
  }

  @ResolveField(() => RecognitionTaskEntity)
  task(@Parent() file: FileEntity) {
    return this.recognitionTaskService.findByFileId(file.id);
  }

  @Query(() => StatsDto)
  stats() {
    return this.fileService.getStats();
  }

  @Subscription(() => RecognitionTaskEntity)
  recognitionTaskUpdated() {
    return pubSub.asyncIterator('test');
  }
}
