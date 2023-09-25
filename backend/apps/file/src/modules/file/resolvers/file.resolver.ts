import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { FileService } from '../services/file.service';
import { FileEntity } from '../entities/file.entity';
import { EnqueueFileInput } from '../inputs/enqueue-file.input';

@Resolver(() => FileEntity)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

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
