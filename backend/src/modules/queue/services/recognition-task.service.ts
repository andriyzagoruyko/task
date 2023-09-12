import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RecognitionTask } from '../schemas/recognition-task.schema';
import { Model } from 'mongoose';

@Injectable()
export class RecognitionTaskService {
  constructor(
    @InjectModel(RecognitionTask.name)
    private readonly recognitionTaskModel: Model<RecognitionTask>,
  ) {}

  async create(data: Partial<RecognitionTask>) {
    const res = await this.recognitionTaskModel.create(data);
    return await res.save();
  }
}
