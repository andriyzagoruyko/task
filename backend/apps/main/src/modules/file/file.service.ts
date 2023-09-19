import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'apps/main/src/modules/file/entities/file.entity';
import { Repository } from 'typeorm';
import { HttpService } from '../http/http.service';
import { QueueService } from '../queue/services/queue.service';
import { EnqueueFileInput } from './dto/enqueue-file.input';
import { FileTypeEnum } from './enums/file-type.enum';
import { FileStatusEnum } from './enums/file-status.enum';
import {
  EventPublisherService,
  GraphQLWebsocketEvents,
} from '../event-publisher/event-publisher.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly httpService: HttpService,
    private readonly queueService: QueueService,
    private readonly eventPublisherService: EventPublisherService,
  ) {}

  findAll() {
    return this.fileRepository
      .createQueryBuilder()
      .orderBy('created_at', 'DESC')
      .getMany();
  }

  findOne(id: number) {
    return this.fileRepository.findOneByOrFail({ id });
  }

  async updateFile(id: number, fileData: DeepPartial<FileEntity>) {
    const { affected } = await this.fileRepository.update(id, fileData);
    if (!affected) {
      throw new NotFoundException('File not found');
    }
    const file = await this.findOne(id);
    this.publishFileUpdateEvent(file);
  }

  private publishFileUpdateEvent(fileUpdated: FileEntity) {
    return this.eventPublisherService.publishEvent<{
      fileUpdated: FileEntity;
    }>(GraphQLWebsocketEvents.FileUpdated, { fileUpdated });
  }

  async createFile(url: string, lang: string) {
    const name = url.split('/').pop();
    return this.httpService
      .getFileProperties(url)
      .then(({ type, size }) =>
        this.fileRepository.save({
          name,
          lang,
          url,
          type,
          size,
        }),
      )
      .catch((err) => {
        if (err instanceof BadRequestException) {
          throw err;
        }
        throw new InternalServerErrorException(String(err));
      });
  }

  async enqueueFile({ url, lang }: EnqueueFileInput) {
    const file = await this.createFile(url, lang);
    console.log('File created', file);

    if (file.type === FileTypeEnum.IMAGE) {
      await this.queueService.publishImageRecognitionTask({
        fileId: file.id,
        url,
        lang,
      });
      console.log('Published to image queue', file.id);
    }

    if (file.type === FileTypeEnum.AUDIO) {
      await this.queueService.publishAudioRecognitionTask({
        fileId: file.id,
        url,
        lang,
      });
      console.log('Published to audio queue', file.id);
    }

    return file;
  }

  async getStats(): Promise<{ totalSize: number; count: number }> {
    return {
      ...(await this.getTotalSizeForPastMonth()),
      ...(await this.getAssetsCountForPastMonth()),
    };
  }

  private async getTotalSizeForPastMonth() {
    return await this.fileRepository
      .createQueryBuilder()
      .select('SUM(size) as totalSize')
      .where('created_at > (NOW() - INTERVAL 1 MONTH)')
      .getRawOne();
  }

  private async getAssetsCountForPastMonth() {
    return await this.fileRepository
      .createQueryBuilder()
      .select('COUNT(id) as count')
      .where('created_at > (NOW() - INTERVAL 1 MONTH)')
      .getRawOne();
  }
}
