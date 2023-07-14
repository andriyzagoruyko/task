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
    routingKey: ImageRoutesEnum.RECOGNIZE,
  })
  async processImageEvent({ fileUrl, lang }: EnqueueFileDto) {
    const name = this.fileService.getFileName(fileUrl);
    const file = await this.fileService.createFileEntity({
      name,
      lang,
      url: fileUrl,
      type: FileTypeEnum.IMAGE,
      status: FileStatusEnum.PROCESSING,
    });
    try {
      await this.fileService.fileExists(fileUrl);

      const size = await this.fileService.getFileSize(fileUrl);
      await this.fileService.updateFileEntity(file.id, { name, size });

      this.logger.log(`Downloading file ${name}`);
      const image = await this.fileService.downloadFile(fileUrl);
      await this.fileService.updateFileEntity(file.id, { size: image.length });

      this.logger.log(`Recognizing text`);
      const text = await this.recognizeImageText(image, lang);
      await this.fileService.updateFileEntity(file.id, {
        text,
        status: FileStatusEnum.READY,
      });
      this.logger.log(`Text recognized successfully:\n${text}`);
    } catch (e) {
      const error = String(e);
      await this.fileService.updateFileEntity(file.id, { error });
      this.logger.error(`Exception occurred during processing image: ${error}`);
    }
  }

  async recognizeImageText(file: Buffer, lang: string) {
    const res = await recognize(file, lang);
    const {
      data: { text },
    } = res;
    return text;
  }
}

