import { Module, forwardRef } from '@nestjs/common';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FileResolver } from './file.resolver';
import { QueueClientModule } from '../queue-client/queue.module';
import { HttpModule } from '../http/http.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    HttpModule,
    forwardRef(() => QueueClientModule),
  ],
  providers: [FileService, FileResolver],
  exports: [FileService],
})
export class FileModule {}
