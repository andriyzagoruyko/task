import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async getStats(): Promise<{ totalSize: number; count: number }> {
    return {
      ...(await this.getTotalSizeForPastMonth()),
      ...(await this.getFilesCountForPastMonth()),
    };
  }

  private async getTotalSizeForPastMonth() {
    return await this.fileRepository
      .createQueryBuilder()
      .select('SUM(size) as totalSize')
      .where('created_at > (NOW() - INTERVAL 1 MONTH)')
      .getRawOne();
  }

  private async getFilesCountForPastMonth() {
    return await this.fileRepository
      .createQueryBuilder()
      .select('COUNT(id) as count')
      .where('created_at > (NOW() - INTERVAL 1 MONTH)')
      .getRawOne();
  }
}
