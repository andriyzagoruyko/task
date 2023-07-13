import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [FileService],
})
export class FileModule {}
