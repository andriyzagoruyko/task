import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RecognitionTaskEntity } from '../entities/recognition-task.entity';
import { Model } from 'mongoose';
import {
  WebsocketClientService,
  WebsocketEventsEnum,
} from '../../socket/websocket-client.service';

@Injectable()
export class RecognitionTaskService {
  constructor(
    @InjectModel(RecognitionTaskEntity.name)
    private readonly recognitionTaskModel: Model<RecognitionTaskEntity>,
    private readonly websocketClientService: WebsocketClientService,
  ) {}

  async findAll(): Promise<RecognitionTaskEntity[]> {
    return this.recognitionTaskModel.find();
  }

  async findOne(id: number): Promise<RecognitionTaskEntity> {
    return this.recognitionTaskModel.findOne({ _id: id }).exec();
  }

  async create(
    data: Partial<RecognitionTaskEntity>,
  ): Promise<RecognitionTaskEntity> {
    const task = await this.recognitionTaskModel.create(data);
    return await task.save();
  }

  async findOneByFileId(fileId: number): Promise<RecognitionTaskEntity> {
    return this.recognitionTaskModel.findOne({ fileId }).exec();
  }

  async update(
    fileId: number,
    data: Partial<RecognitionTaskEntity>,
  ): Promise<RecognitionTaskEntity> {
    await this.recognitionTaskModel.updateOne({ fileId }, data).exec();

    const task = await this.findOneByFileId(fileId);
    this.websocketClientService.emit(
      WebsocketEventsEnum.RecognitionTaskUpdated,
      task,
    );

    return task;
  }
}
