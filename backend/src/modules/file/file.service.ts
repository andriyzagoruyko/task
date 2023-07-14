import { Injectable, Logger } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import * as ufs from 'url-file-size';
import * as http from 'http';
import * as https from 'https';

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

  getFileName(url: string) {
    return url.split('/').pop();
  }

  async getFileSize(url: string) {
    return await ufs(url);
  }

  async getFileExtension(url: string) {
    return new Promise<string>((resolve, reject) => {
      const req = url.startsWith('https://')
        ? https.get(url, { timeout: 1000 })
        : http.get(url, { timeout: 1000 });

      req.once('response', (response) => {
        req.destroy();
        if (response.statusCode === 200) {
          return resolve(response.headers['content-type']);
        }
        reject(
          new Error(
            `Unexpected error retrieving file, status: ${response.statusCode}`,
          ),
        );
      });
      req.once('error', (e) => {
        req.destroy();
        reject(e);
      });
      req.once('timeout', (e) => {
        req.destroy();
        reject(new Error(`File is not accessible`));
      });
    });
  }

  async fileExists(url: string) {
    return new Promise((resolve, reject) => {
      const req = url.startsWith('https://')
        ? https.get(url, { timeout: 1000 })
        : http.get(url, { timeout: 1000 });

      req.once('response', (response) => {
        req.destroy();
        if (response.statusCode === 200) {
          return resolve(true);
        }
        reject(
          new Error(
            `Unexpected error retrieving file, status: ${response.statusCode}`,
          ),
        );
      });
      req.once('error', (e) => {
        req.destroy();
        reject(e);
      });
      req.once('timeout', (e) => {
        req.destroy();
        reject(new Error(`File is not accessible`));
      });
    });
  }
}
