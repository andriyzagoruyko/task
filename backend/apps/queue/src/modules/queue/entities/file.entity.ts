import { ObjectType, Directive, ID, Field } from '@nestjs/graphql';
import { RecognitionTaskEntity } from './recognition-task.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class FileEntity {
  @Field(() => ID)
  @Directive('@external')
  id: number;

  @Field(() => RecognitionTaskEntity, { nullable: true })
  task: RecognitionTaskEntity;
}
