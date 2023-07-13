import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { ImageRoutesEnum } from '../enums/image-routes.enum';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { FileService } from 'src/modules/file/file.service';
import { FileTypeEnum } from 'src/modules/file/enums/file-type.enum';

@Injectable()
export class ImageProcessingConsumer {
  constructor(private readonly fileService: FileService) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_IMAGE_TOPIC,
    routingKey: ImageRoutesEnum.PROCESS,
  })
  processImageEvent(data: EnqueueFileDto) {
    const file = this.fileService.createFileEntity(data, FileTypeEnum.IMAGE);
  }
}
