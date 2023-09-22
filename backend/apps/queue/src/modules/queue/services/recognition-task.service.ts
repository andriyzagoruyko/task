import { Injectable, NotFoundException } from '@nestjs/common';
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
    const res = await this.recognitionTaskModel.findOne({ _id: id }).exec();
    if (!res) {
      throw new NotFoundException(`Recognition task ${id} not found`);
    }
    return res;
  }
  async findOneByFileId(fileId: number): Promise<RecognitionTaskEntity> {
    const res = await this.recognitionTaskModel.findOne({ fileId }).exec();
    if (!res) {
      throw new NotFoundException(
        `Recognition task with fileId ${fileId} not found`,
      );
    }
    return res;
  }

  async create(
    data: Partial<RecognitionTaskEntity>,
  ): Promise<RecognitionTaskEntity> {
    const task = await this.recognitionTaskModel.create(data);
    return await task.save();
  }

  async update(
    fileId: number,
    data: Partial<RecognitionTaskEntity>,
  ): Promise<RecognitionTaskEntity> {
    const res = await this.recognitionTaskModel
      .updateOne({ fileId }, data, { upsert: false })
      .exec();

    if (!res.modifiedCount) {
      throw new NotFoundException(
        `Recognition task with fileId ${fileId} not found`,
      );
    }

    const task = await this.findOneByFileId(fileId);
    this.websocketClientService.emit(
      WebsocketEventsEnum.RecognitionTaskUpdated,
      task,
    );

    return task;
  }
}
