import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { FileService } from '../file.service';
import { FileEntity } from '../entities/file.entity';
import { EnqueueFileInput } from '../inputs/enqueue-file.input';
import { StatsDto } from '../dto/stats.dto';

@Resolver(() => FileEntity)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

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

  @Query(() => StatsDto)
  stats() {
    return this.fileService.getStats();
  }
}
