import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EnqueueFileDto } from './dto/enqueue-file.dto';
import { ImageRoutesEnum } from './enums/image-routes.enum';
import { RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class QueueService {
  private readonly SUPPORTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png'];
  private readonly SUPPORTED_AUDIO_TYPES = ['mp3', 'mp4'];
  private readonly logger = new Logger(QueueService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  enqueueFile(data: EnqueueFileDto) {
    const extension = this.getUrlExtension(data.fileUrl);
    this.logger.log(`New event received ${data}`);

    if (this.SUPPORTED_IMAGE_TYPES.includes(extension)) {
      return this.amqpConnection.publish<EnqueueFileDto>(
        RABBITMQ_IMAGE_TOPIC,
        ImageRoutesEnum.PROCESS,
        data,
      );
    }

    throw new BadRequestException(`${extension} is not supported`);
  }

  getUrlExtension(url: string) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }
}
