import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { FileEntity } from './file.entity';
import { MongoID } from '@app/shared/graphql-types/mongo-id';

@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@key(fields: "fileId")')
export class RecognitionTaskEntity {
  @Field(() => MongoID)
  @Directive('@external')
  id: string;

  @Field(() => ID)
  @Directive('@external')
  fileId: number;

  @Field(() => FileEntity)
  file: FileEntity;
}
