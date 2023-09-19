import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '../http/http.service';
import { EnqueueFileInput } from './inputs/enqueue-file.input';
import { FileTypeEnum } from './enums/file-type.enum';
import { QueueClientService } from '../queue-client/queue.service';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly httpService: HttpService,
    private readonly queueClientService: QueueClientService,
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
    return await this.findOne(id);
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
      await this.queueClientService.publishImageRecognitionTask({
        fileId: file.id,
        url,
        lang,
      });
      console.log('Published to image queue', file.id);
    }

    if (file.type === FileTypeEnum.AUDIO) {
      await this.queueClientService.publishAudioRecognitionTask({
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
