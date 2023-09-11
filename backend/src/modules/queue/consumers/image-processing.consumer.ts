import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { ImageRoutesEnum } from '../enums/image-routes.enum';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { FileService } from 'src/modules/file/file.service';
import { FileTypeEnum } from 'src/modules/file/enums/file-type.enum';
import { FileStatusEnum } from 'src/modules/file/enums/file-status.enum';
import { recognize } from 'tesseract.js';
import { HttpService } from 'src/modules/http/http.service';
import { WebsocketService } from 'src/modules/websocket/websocket.service';

@Injectable()
export class ImageProcessingConsumer {
  logger = new Logger(ImageProcessingConsumer.name);

  constructor(
    private readonly fileService: FileService,
    private readonly httpService: HttpService,
    private readonly websocketService: WebsocketService,
  ) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_IMAGE_TOPIC,
    routingKey: ImageRoutesEnum.RECOGNIZE,
  })
  async processImageEvent({ fileId, socketId }: EnqueueFileDto) {
    const file = await this.fileService.findOne(fileId);
    try {
      this.logger.log(`Downloading file ${file.name}`);
      const image = await this.httpService.downloadFile(
        file.url,
        (progress: number) => {
          if (socketId) {
            this.websocketService.sendProgressToUser(socketId, progress);
          }
        },
      );

      this.logger.log(`Recognizing text`);
      const text = await this.recognizeImageText(image, file.lang);
      await this.fileService.updateFile(file.id, {
        text,
        status: FileStatusEnum.READY,
      });
      this.logger.log(`Text recognized successfully:\n${text}`);
    } catch (e) {
      const error = String(e);
      await this.fileService.updateFile(file.id, { error });
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
