import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { ImageRoutesEnum } from '../enums/image-routes.enum';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { FileService } from 'src/modules/file/file.service';
import { FileTypeEnum } from 'src/modules/file/enums/file-type.enum';
import { FileStatusEnum } from 'src/modules/file/enums/file-status.enum';
import { recognize } from 'tesseract.js';

@Injectable()
export class ImageProcessingConsumer {
  logger = new Logger(ImageProcessingConsumer.name);

  constructor(private readonly fileService: FileService) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_IMAGE_TOPIC,
    routingKey: ImageRoutesEnum.PROCESS,
  })
  async processImageEvent({ fileUrl, lang }: EnqueueFileDto) {
    const name = await this.fileService.getFileName(fileUrl);
    const size = await this.fileService.getFileSize(fileUrl);
    const file = await this.fileService.createFileEntity({
      name,
      size,
      lang,
      url: fileUrl,
      type: FileTypeEnum.IMAGE,
      status: FileStatusEnum.PROCESSING,
    });

    try {
      this.logger.log(`Downloading file ${name}`);
      const image = await this.fileService.downloadFile(fileUrl);
      await this.fileService.updateFileEntity(file.id, { size: image.length });

      this.logger.log(`Recognizing text`);
      const text = await this.recognizeImage(image, lang);
      await this.fileService.updateFileEntity(file.id, {
        text,
        status: FileStatusEnum.READY,
      });
      this.logger.log(`Text recognized successfully:\n${text}`);
    } catch (e) {
      this.logger.error(`Unexpected exception during processing image: ${e}`);
    }
  }

  async recognizeImage(file: Buffer, lang: string) {
    const res = await recognize(file, lang);
    const {
      data: { text },
    } = res;
    return text;
  }
}
