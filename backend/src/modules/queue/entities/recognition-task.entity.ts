import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileTaskDocument = HydratedDocument<RecognitionTaskEntity>;

@Schema()
@ObjectType()
export class RecognitionTaskEntity {
  @Prop({ required: true })
  @Field()
  fileId: number;

  @Prop({ required: true })
  @Field()
  progress: number;
}

export const RecognitionTaskSchema = SchemaFactory.createForClass(
  RecognitionTaskEntity,
);
