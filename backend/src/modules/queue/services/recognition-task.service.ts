import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RecognitionTaskEntity } from '../entities/recognition-task.entity';
import { Model } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';
import { RECOGNITION_TASK_UPDATED } from '../queue.resolver';

const pubSub = new PubSub();

@Injectable()
export class RecognitionTaskService {
  constructor(
    @InjectModel(RecognitionTaskEntity.name)
    private readonly recognitionTaskModel: Model<RecognitionTaskEntity>,
  ) {}

  async create(data: Partial<RecognitionTaskEntity>) {
    const task = await this.recognitionTaskModel.create(data);
    return await task.save();
  }

  async findByFileId(fileId: number) {
    return this.recognitionTaskModel.findOne({ fileId }).exec();
  }

  async updateOneByFileId(
    fileId: number,
    data: Partial<RecognitionTaskEntity>,
  ) {
    const task = this.recognitionTaskModel.updateOne({ fileId }, data).exec();
    pubSub.publish(RECOGNITION_TASK_UPDATED, { taskUpdated: task });
  }
}
