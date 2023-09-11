import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileEntity } from './entities/file.entity';
import { EnqueueFileInput } from './dto/enqueue-file.input';
import { QueueService } from '../queue/queue.service';

@Resolver(() => FileEntity)
export class FileResolver {
  constructor(
    private readonly fileService: FileService,
    private readonly queueService: QueueService,
  ) {}

  @Query(() => [FileEntity])
  files() {
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
}
