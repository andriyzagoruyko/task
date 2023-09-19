import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GraphQLObjectID } from '../../../utils/graphQLObjectID';

export type FileTaskDocument = HydratedDocument<RecognitionTaskEntity>;

@Schema()
@ObjectType()
export class RecognitionTaskEntity {
  @Prop({ required: true })
  @Field(() => Float)
  fileId: number;

  @Prop({ required: true })
  @Field(() => Float)
  progress: number;

  @Field(() => GraphQLObjectID)
  id: string;
}

export const RecognitionTaskSchema = SchemaFactory.createForClass(
  RecognitionTaskEntity,
);
