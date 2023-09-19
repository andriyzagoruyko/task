import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { QueueRoutesEnum } from '../enums/queue-routes.enum';
import {
  RABBITMQ_AUDIO_TOPIC,
  RABBITMQ_IMAGE_TOPIC,
} from '../../../definitions';

@Injectable()
export class QueueService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishImageRecognitionTask(data: EnqueueFileDto) {
    await this.amqpConnection.publish<EnqueueFileDto>(
      RABBITMQ_IMAGE_TOPIC,
      QueueRoutesEnum.RECOGNIZE_IMAGE,
      data,
    );
  }

  async publishAudioRecognitionTask(data: EnqueueFileDto) {
    await this.amqpConnection.publish<EnqueueFileDto>(
      RABBITMQ_AUDIO_TOPIC,
      QueueRoutesEnum.RECOGNIZE_AUDIO,
      data,
    );
  }
}
