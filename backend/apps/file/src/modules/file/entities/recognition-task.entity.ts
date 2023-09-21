import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { FileEntity } from './file.entity';

@ObjectType()
@Directive('@key(fields: "fileId")')
export class RecognitionTaskEntity {
  @Field(() => ID)
  @Directive('@external')
  fileId: number;

  @Field(() => FileEntity)
  file: FileEntity;
}
