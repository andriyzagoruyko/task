import { ObjectType, Field, Float, Directive, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { MongoID } from '../../../../../../libs/shared/src/graphql-types/mongo-id';

export type FileTaskDocument = HydratedDocument<RecognitionTaskEntity>;

@Schema()
@ObjectType()
@Directive('@key(fields: "fileId")')
export class RecognitionTaskEntity {
  @Prop({ default: ({ _id }) => String(_id) })
  @Field(() => MongoID)
  id: string;

  @Prop({ required: true })
  @Field(() => ID)
  fileId: number;

  @Prop({ required: true, default: 0 })
  @Field(() => Float)
  progress: number;

  @Prop({ required: true, type: String, default: TaskStatusEnum.DOWNLOADING })
  @Field(() => String)
  status: TaskStatusEnum;

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
