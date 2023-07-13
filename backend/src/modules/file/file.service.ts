import { Injectable } from '@nestjs/common';
import { EnqueueFileDto } from '../queue/dto/enqueue-file.dto';

@Injectable()
export class FileService {
  constructor() {}

  createFile(data: EnqueueFileDto) {
    console.log('creating file', data);
  }
}
