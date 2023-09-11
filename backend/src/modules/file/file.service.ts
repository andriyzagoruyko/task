import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_AUDIO_TYPES } from 'src/definitions';
import { EnqueueFileDto } from '../queue/dto/enqueue-file.dto';
import { HttpService } from '../http/http.service';
import { QueueService } from '../queue/queue.service';
import { EnqueueFileInput } from './dto/enqueue-file.input';
import { FileTypeEnum } from './enums/file-type.enum';
import { FileStatusEnum } from './enums/file-status.enum';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly httpService: HttpService,
    private readonly queueService: QueueService,
  ) {}

  findAll() {
    return this.fileRepository.createQueryBuilder().getMany();
  }

  findOne(id: number) {
    return this.fileRepository.findOneBy({ id });
  }

  createFile(fileData: DeepPartial<FileEntity>) {
    return this.fileRepository.save({ ...fileData });
  }

  updateFile(id: number, fileData: DeepPartial<FileEntity>) {
    return this.fileRepository.update(id, fileData);
  }

  async getStats() {
    return {
      ...(await this.getTotalSizeForPastMonth()),
      ...(await this.getAssetsCountForPastMonth()),
    };
  }

  async getTotalSizeForPastMonth() {
    return await this.fileRepository
      .createQueryBuilder()
      .select('SUM(size) as totalSize')
      .where('created_at > (NOW() - INTERVAL 1 MONTH)')
      .getRawOne();
  }

  async getAssetsCountForPastMonth() {
    return await this.fileRepository
      .createQueryBuilder()
      .select('COUNT(id) as count')
      .where('created_at > (NOW() - INTERVAL 1 MONTH)')
      .getRawOne();
  }

  async enqueueFile({ url, lang, socketId }: EnqueueFileInput) {
    const file = await this.httpService
      .getFileProperties(url)
      .then(({ name, type, size }) => {
        const status = FileStatusEnum.SAVED;
        return this.createFile({ name, lang, url, type, size, status });
      })
      .catch((err) => {
        if (err instanceof BadRequestException) {
          throw err;
        }
        const error = String(err);
        const status = FileStatusEnum.FAILED;
        return this.createFile({ lang, url, status, error });
        //throw new InternalServerErrorException(error);
      });

    if (file.isImage) {
      this.queueService.publishToImageTopic({ fileId: file.id, socketId });
    }

    if (file.isAudio) {
      this.queueService.publishToImageTopic({ fileId: file.id, socketId });
    }

    return file;
  }
}
