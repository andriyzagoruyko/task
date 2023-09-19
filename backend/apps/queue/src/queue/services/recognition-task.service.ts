import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RecognitionTaskEntity } from '../entities/recognition-task.entity';
import { Model } from 'mongoose';
import { GraphQLPublisherService, GraphQLWebsocketEvents } from '../../graphql-publisher/graphql-publisher.service';


@Injectable()
export class RecognitionTaskService {
  constructor(
    @InjectModel(RecognitionTaskEntity.name)
    private readonly recognitionTaskModel: Model<RecognitionTaskEntity>,
    private readonly graphqlPublisherService: GraphQLPublisherService,
  ) {}

  async create(data: Partial<RecognitionTaskEntity>) {
    const task = await this.recognitionTaskModel.create(data);
    return await task.save();
  }

  async findByFileId(fileId: number) {
    return this.recognitionTaskModel.findOne({ fileId }).exec();
  }

  async update(fileId: number, data: Partial<RecognitionTaskEntity>) {
    await this.recognitionTaskModel.updateOne({ fileId }, data).exec();

    const taskUpdated = await this.findByFileId(fileId);

    this.graphqlPublisherService.publishEvent<{
      taskUpdated: RecognitionTaskEntity;
    }>(GraphQLWebsocketEvents.TaskUpdated, { taskUpdated });

    return taskUpdated;
  }
}
