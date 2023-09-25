import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { RecognitionTaskEntity } from '../entities/recognition-task.entity';
import { FileService } from '../services/file.service';

@Resolver(() => RecognitionTaskEntity)
export class RecognitionTaskResolver {
  constructor(private readonly fileService: FileService) {}

  @ResolveField(() => File, { nullable: true })
  file(@Parent() task: RecognitionTaskEntity) {
    return this.fileService.findOne(task.fileId);
  }
}
