import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RecognitionTaskService } from '../services/recognition-task.service';
import { RABBITMQ_AUDIO_TOPIC } from '@app/shared/definitions';
import { QueueRoutesEnum } from '@app/shared/queue/enums/queue-routes.enum';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { EnqueueFileDto } from '@app/shared/queue/dto/enqueue-file.dto';

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
      status: TaskStatusEnum.READY,
    });
  }
}
