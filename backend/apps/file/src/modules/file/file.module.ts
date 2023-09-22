import { Module, forwardRef } from '@nestjs/common';
import { FileService } from './services/file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FileResolver } from './resolvers/file.resolver';
import { QueueClientModule } from '../queue-client/queue.module';
import { HttpModule } from '../http/http.module';
import { RecognitionTaskResolver } from './resolvers/recognition-task.resolver';
import { StatsResolver } from './resolvers/stats.resolver';
import { StatsService } from './services/stats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    HttpModule,
    forwardRef(() => QueueClientModule),
  ],
  providers: [
    FileService,
    FileResolver,
    RecognitionTaskResolver,
    StatsResolver,
    StatsService,
  ],
  exports: [FileService],
})
export class FileModule {}
