import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  getFiles() {
    return this.fileRepository.createQueryBuilder().getMany();
  }

  createFile(fileData: DeepPartial<FileEntity>) {
    return this.fileRepository.save({ ...fileData });
  }

  updateFile(id: number, fileData: DeepPartial<FileEntity>) {
    return this.fileRepository.update(id, fileData);
  }
}
