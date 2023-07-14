import { Body, Controller, Post } from '@nestjs/common';
import { EnqueueFileDto } from './dto/enqueue-file.dto';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  enqueueFile(@Body() data: EnqueueFileDto) {
    return this.queueService.enqueueFile(data);
  }
}
