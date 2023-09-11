import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { EnqueueFileDto } from './dto/enqueue-file.dto';
import { ImageRoutesEnum } from './enums/image-routes.enum';
import { RABBITMQ_AUDIO_TOPIC, RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { AudioRoutesEnum } from './enums/audio-routes.enum';

@Injectable()
export class QueueService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  publishToImageTopic(data: EnqueueFileDto) {
    this.amqpConnection.publish<EnqueueFileDto>(
      RABBITMQ_IMAGE_TOPIC,
      ImageRoutesEnum.RECOGNIZE,
      data,
    );
  }

  publishToAudioTopic(data: EnqueueFileDto) {
    this.amqpConnection.publish<EnqueueFileDto>(
      RABBITMQ_AUDIO_TOPIC,
      AudioRoutesEnum.RECOGNIZE,
      data,
    );
  }
}
