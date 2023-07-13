import { Injectable } from '@nestjs/common';
import { EnqueueFileDto } from '../queue/dto/enqueue-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { FileStatusEnum } from './enums/file-status.enum';
import { FileTypeEnum } from './enums/file-type.enum';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  createFileEntity(data: EnqueueFileDto, type: FileTypeEnum) {
    return this.fileRepository.save({
      url: data.fileUrl,
      lang: data.lang,
      status: FileStatusEnum.PROCESSING,
      type,
    });
  }

  downloadFile(file:FileEntity) {
    
  }
}
