import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
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
    return this.fileRepository
      .createQueryBuilder()
      .orderBy('created_at', 'DESC')
      .getMany();
  }

  findOne(id: number) {
    return this.fileRepository.findOneByOrFail({ id });
  }

  createFile(fileData: DeepPartial<FileEntity>) {
    return this.fileRepository.save({ ...fileData });
  }

  updateFile(id: number, fileData: DeepPartial<FileEntity>) {
    return this.fileRepository.update(id, fileData);
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

  async enqueueFile({ url, lang, socketId }: EnqueueFileInput) {
    const name = this.getUrlFilename(url);
    const file = await this.httpService
      .getFileProperties(url)
      .then(({ type, size }) => {
        const status = FileStatusEnum.SAVED;
        return this.createFile({ name, lang, url, type, size, status });
      })
      .catch((err) => {
        if (err instanceof BadRequestException) {
          throw err;
        }
        throw new InternalServerErrorException(String(err));
      });

    console.log('File created', file);

    if (file.type === FileTypeEnum.IMAGE) {
      this.queueService.publishToImageTopic({ fileId: file.id, socketId });
      console.log('Published to image queue', file.id);
    }

    if (file.type === FileTypeEnum.AUDIO) {
      this.queueService.publishToImageTopic({ fileId: file.id, socketId });
      console.log('Published to audio queue', file.id);
    }

    return file;
  }

  getUrlFilename(url: string) {
    return url.split('/').pop();
  }
}
