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
import { FileService } from '../file/file.service';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly fileService: FileService,
  ) {}

  async enqueueFile(data: EnqueueFileDto) {
    let extension = '';
    try {
      extension = await this.fileService.getFileExtension(data.fileUrl);
      this.logger.log(`New event received ${JSON.stringify(data)}`);
    } catch (e) {
      throw new BadRequestException(String(e));
    }

    if (SUPPORTED_IMAGE_TYPES.includes(extension)) {
      return this.amqpConnection.publish<EnqueueFileDto>(
        RABBITMQ_IMAGE_TOPIC,
        ImageRoutesEnum.PROCESS,
        data,
      );
    }

    if (SUPPORTED_AUDIO_TYPES.includes(extension)) {
      return this.amqpConnection.publish<EnqueueFileDto>(
        RABBITMQ_AUDIO_TOPIC,
        AudioRoutesEnum.PROCESS,
        data,
      );
    }

    throw new BadRequestException(`Extension ${extension} is not supported`);
  }
  getUrlExtension(url: string) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }
}
