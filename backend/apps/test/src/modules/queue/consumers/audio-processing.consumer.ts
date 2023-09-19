import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RABBITMQ_AUDIO_TOPIC } from 'src/definitions';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { FileService } from 'src/modules/file/file.service';
import { FileStatusEnum } from 'src/modules/file/enums/file-status.enum';
import { QueueRoutesEnum } from '../enums/queue-routes.enum';



@Injectable()
export class AudioProcessingConsumer {
  logger = new Logger(AudioProcessingConsumer.name);

  constructor(private readonly fileService: FileService) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_AUDIO_TOPIC,
    routingKey: QueueRoutesEnum.RECOGNIZE_AUDIO,
  })
  async processAudioEvent({ fileId }: EnqueueFileDto) {
    await this.fileService.updateFile(fileId, { status: FileStatusEnum.READY });
  }
}
