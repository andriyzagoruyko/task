import { Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { HttpModule as AxiosModule } from '@nestjs/axios';

@Module({
  imports: [AxiosModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
