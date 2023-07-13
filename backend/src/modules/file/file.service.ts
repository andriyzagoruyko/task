import { Injectable } from '@nestjs/common';
import { EnqueueFileDto } from '../queue/dto/enqueue-file.dto';

import { QueueService } from '../queue/queue.service';

@Injectable()
export class FileService {
  constructor(readonly queueService: QueueService) {}

  enqueueFile(data: EnqueueFileDto) {
    console.log(data);
    this.queueService.enqueueFile(data);
  }
}
