import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileTaskDocument = HydratedDocument<RecognitionTask>;

@Schema()
export class RecognitionTask {
  @Prop({ required: true })
  fileId: number;

  @Prop({ required: true })
  progress: number;
}

export const RecognitionTaskSchema =
  SchemaFactory.createForClass(RecognitionTask);
