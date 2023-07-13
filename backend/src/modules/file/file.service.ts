import { Injectable, Logger } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import * as ufs from 'url-file-size';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly httpService: HttpService,
  ) {}

  createFileEntity(fileData: DeepPartial<FileEntity>) {
    return this.fileRepository.save({ ...fileData });
  }

  updateFileEntity(id: number, fileData: DeepPartial<FileEntity>) {
    return this.fileRepository.update(id, fileData);
  }

  async downloadFile(url: string) {
    const source$ = this.httpService.get<Buffer>(url, {
      responseType: 'arraybuffer',
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const res = await lastValueFrom<AxiosResponse<Buffer, any>>(source$);
    return res.data;
  }

  async getFileSize(url: string) {
    return ufs(url);
  }

  async getFileName(url) {
    return url.split('/').pop();
  }
}
