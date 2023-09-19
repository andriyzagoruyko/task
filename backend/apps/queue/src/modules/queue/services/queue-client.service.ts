import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

import { EnqueueFileDto } from '@app/shared/queue/dto/enqueue-file.dto';
import {
  RABBITMQ_IMAGE_TOPIC,
  RABBITMQ_AUDIO_TOPIC,
} from '@app/shared/definitions';
import { QueueRoutesEnum } from '@app/shared/queue/enums/queue-routes.enum';

@Injectable()
export class QueueClientService {
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
