import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FileEntity } from './entities/file.entity';
import { RecognitionTaskService } from './services/recognition-task.service';
import { RecognitionTaskEntity } from './entities/recognition-task.entity';

@Resolver(() => FileEntity)
export class FileResolver {
  constructor(
    private readonly recognitionTaskService: RecognitionTaskService,
  ) {}

  @ResolveField(() => RecognitionTaskEntity)
  task(@Parent() file: FileEntity) {
    return this.recognitionTaskService.findOneByFileId(file.id);
  }
}
