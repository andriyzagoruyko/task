import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { QueueRoutesEnum } from '../enums/queue-routes.enum';
import { RABBITMQ_AUDIO_TOPIC, RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { RecognitionTaskService } from './recognition-task.service';

@Injectable()
export class QueueService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly recognitionTaskService: RecognitionTaskService,
  ) {}

  async publishImageRecognitionTask(fileId: number) {
    await this.recognitionTaskService.create({ fileId, progress: 0 });
    await this.amqpConnection.publish<EnqueueFileDto>(
      RABBITMQ_IMAGE_TOPIC,
      QueueRoutesEnum.RECOGNIZE_IMAGE,
      { fileId },
    );
  }

  async publishAudioRecognitionTask(fileId: number) {
    await this.recognitionTaskService.create({ fileId, progress: 0 });
    await this.amqpConnection.publish<EnqueueFileDto>(
      RABBITMQ_AUDIO_TOPIC,
      QueueRoutesEnum.RECOGNIZE_AUDIO,
      { fileId },
    );
  }
}
