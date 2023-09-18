import { Module, forwardRef } from '@nestjs/common';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FileController } from './file.controller';
import { FileResolver } from './file.resolver';
import { QueueModule } from '../queue/queue.module';
import { HttpModule } from '../http/http.module';
import { EventPublisherModule } from '../event-publisher/event-publisher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    HttpModule,
    forwardRef(() => QueueModule),
    EventPublisherModule,
  ],
  providers: [FileService, FileResolver],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}
