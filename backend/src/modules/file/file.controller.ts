import { Controller, Get } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getFiles() {
    return this.fileService.getFiles();
  }

  @Get('stats')
  getStats() {
    return this.fileService.getStats();
  }
}
