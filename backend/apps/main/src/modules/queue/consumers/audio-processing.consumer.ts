import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RABBITMQ_AUDIO_TOPIC } from '../../../definitions';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { FileStatusEnum } from '../../../modules/file/enums/file-status.enum';
import { QueueRoutesEnum } from '../enums/queue-routes.enum';
import { RecognitionTaskService } from '../services/recognition-task.service';

@Injectable()
export class AudioProcessingConsumer {
  logger = new Logger(AudioProcessingConsumer.name);

  constructor(
    private readonly recognitionTaskService: RecognitionTaskService,
  ) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_AUDIO_TOPIC,
    routingKey: QueueRoutesEnum.RECOGNIZE_AUDIO,
  })
  async processAudioEvent({ fileId }: EnqueueFileDto) {
    this.recognitionTaskService.create({
      fileId,
      progress: 100,
      status: FileStatusEnum.READY,
    });
  }
}
