import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EnqueueFileDto } from './dto/enqueue-file.dto';
import { ImageRoutesEnum } from './enums/image-routes.enum';
import {
  RABBITMQ_AUDIO_TOPIC,
  RABBITMQ_IMAGE_TOPIC,
  SUPPORTED_AUDIO_TYPES,
  SUPPORTED_IMAGE_TYPES,
} from 'src/definitions';
import { AudioRoutesEnum } from './enums/audio-routes.enum';
import { HttpService } from '../http/http.service';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly httpService: HttpService,
  ) {}

  async enqueueFile(data: EnqueueFileDto) {
    let extension = '';
    try {
      extension = await this.httpService.getContentType(data.fileUrl);
      this.logger.log(`New event received ${JSON.stringify(data)}`);
    } catch (e) {
      throw new BadRequestException(String(e));
    }

    if (SUPPORTED_IMAGE_TYPES.includes(extension)) {
      return this.publishToImageTopic(data);
    }

    if (SUPPORTED_AUDIO_TYPES.includes(extension)) {
      return this.publishToAudioTopic(data);
    }

    throw new BadRequestException(`Extension ${extension} is not supported`);
  }

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
