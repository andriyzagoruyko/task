import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { EnqueueFileDto } from './dto/enqueue-file.dto';
import { ImageRoutesEnum } from './enums/image-routes.enum';
import { RABBITMQ_AUDIO_TOPIC, RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { AudioRoutesEnum } from './enums/audio-routes.enum';
import { HttpService } from '../http/http.service';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly httpService: HttpService,
  ) {}

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
