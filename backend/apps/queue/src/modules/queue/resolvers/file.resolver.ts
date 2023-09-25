import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FileEntity } from '../entities/file.entity';
import { RecognitionTaskEntity } from '../entities/recognition-task.entity';
import { RecognitionTaskService } from '../services/recognition-task.service';

@Resolver(() => FileEntity)
export class FileResolver {
  constructor(
    private readonly recognitionTaskService: RecognitionTaskService,
  ) {}

  @ResolveField(() => RecognitionTaskEntity, { nullable: true })
  task(@Parent() file: FileEntity) {
    return this.recognitionTaskService.findOneByFileId(file.id);
  }
}
