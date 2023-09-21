import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { RecognitionTaskEntity } from './entities/recognition-task.entity';
import { FileService } from './file.service';

@Resolver(() => RecognitionTaskEntity)
export class RecognitionTaskResolver {
  constructor(private readonly fileService: FileService) {}

  @ResolveField(() => File)
  file(@Parent() task: RecognitionTaskEntity) {
    return this.fileService.findOne(task.fileId);
  }
}
