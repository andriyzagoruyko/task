import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GraphQLObjectID } from '../../../utils/graphQLObjectID';
import { FileStatusEnum } from '../../file/enums/file-status.enum';

export type FileTaskDocument = HydratedDocument<RecognitionTaskEntity>;

@Schema()
@ObjectType()
export class RecognitionTaskEntity {
  @Field(() => GraphQLObjectID)
  id: string;

  @Prop({ required: true })
  @Field(() => Float)
  fileId: number;

  @Prop({ required: true, default: 0 })
  @Field(() => Float)
  progress: number;

  @Prop({ required: true, type: String, default: FileStatusEnum.DOWNLOADING })
  @Field(() => String)
  status: FileStatusEnum;

  @Prop({ nullable: true })
  @Field({ nullable: true })
  error!: string | null;

  @Prop({ nullable: true })
  @Field(() => String, { nullable: true })
  result!: string | null;
}

export const RecognitionTaskSchema = SchemaFactory.createForClass(
  RecognitionTaskEntity,
);
