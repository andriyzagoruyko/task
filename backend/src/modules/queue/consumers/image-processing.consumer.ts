import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { ImageRoutesEnum } from '../enums/image-routes.enum';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { FileService } from 'src/modules/file/file.service';
import { FileStatusEnum } from 'src/modules/file/enums/file-status.enum';
import { recognize } from 'tesseract.js';
import { HttpService } from 'src/modules/http/http.service';
import { RecognitionTaskService } from '../services/recognition-task.service';

@Injectable()
export class ImageProcessingConsumer {
  logger = new Logger(ImageProcessingConsumer.name);

  constructor(
    private readonly fileService: FileService,
    private readonly httpService: HttpService,
    private readonly recognitionTaskService: RecognitionTaskService,
  ) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_IMAGE_TOPIC,
    routingKey: ImageRoutesEnum.RECOGNIZE,
  })
  async processImageEvent({ fileId }: EnqueueFileDto) {
    const file = await this.fileService.findOne(fileId);
    try {
      this.logger.log(`Downloading file ${file.name}`);
      const image = await this.httpService.downloadFile(
        file.url,
        async (progress: number) => {
          file.task = await this.recognitionTaskService.updateOneByFileId(
            fileId,
            { progress },
          );
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
