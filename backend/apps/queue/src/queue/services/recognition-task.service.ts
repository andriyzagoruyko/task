import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RecognitionTaskEntity } from '../entities/recognition-task.entity';
import { Model } from 'mongoose';

@Injectable()
export class RecognitionTaskService {
  constructor(
    @InjectModel(RecognitionTaskEntity.name)
    private readonly recognitionTaskModel: Model<RecognitionTaskEntity>,
  ) {}

  async findAll() {
    return this.recognitionTaskModel.find();
  }

  async findOne(id: number) {
    return this.recognitionTaskModel.findOne({ _id: id }).exec();
  }

  async create(data: Partial<RecognitionTaskEntity>) {
    const task = await this.recognitionTaskModel.create(data);
    return await task.save();
  }

  async findOneByFileId(fileId: number) {
    return this.recognitionTaskModel.findOne({ fileId }).exec();
  }

  async update(fileId: number, data: Partial<RecognitionTaskEntity>) {
    await this.recognitionTaskModel.updateOne({ fileId }, data).exec();
    return this.findOneByFileId(fileId);
  }
}
