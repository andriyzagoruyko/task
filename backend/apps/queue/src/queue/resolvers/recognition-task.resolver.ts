import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { RecognitionTaskEntity } from '../entities/recognition-task.entity';
import { RecognitionTaskService } from '../services/recognition-task.service';

@Resolver(() => RecognitionTaskEntity)
export class RecognitionTaskResolver {
  constructor(
    private readonly recognitionTaskService: RecognitionTaskService,
  ) {}

  @Query(() => [RecognitionTaskEntity], { name: 'recognitionTasks' })
  async findAll() {
    return this.recognitionTaskService.findAll();
  }

  @Query(() => RecognitionTaskEntity, { name: 'recognitionTask' })
  async findOne(@Args('fileId', { type: () => ID }) id: number) {
    return this.recognitionTaskService.findOne(id);
  }
}
