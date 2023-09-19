import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RABBITMQ_IMAGE_TOPIC } from '../../../definitions';
import { QueueRoutesEnum } from '../enums/queue-routes.enum';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { FileService } from '../../../modules/file/file.service';
import { FileStatusEnum } from '../../../modules/file/enums/file-status.enum';
import { recognize } from 'tesseract.js';
import { HttpService } from '../../../modules/http/http.service';
import { RecognitionTaskService } from '../services/recognition-task.service';
import * as _ from 'lodash';

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
    routingKey: QueueRoutesEnum.RECOGNIZE_IMAGE,
  })
  async processImageEvent({ fileId }: EnqueueFileDto) {
    const file = await this.fileService.findOne(fileId);
    await this.fileService.updateFile(file.id, {
      status: FileStatusEnum.DOWNLOADING,
    });

    try {
      this.logger.log(`Downloading file ${file.name}`);
      const handleDownloadProgress = _.throttle(async (progress: number) => {
        file.task = await this.recognitionTaskService.updateOneByFileId(
          fileId,
          { progress },
        );
      }, 100);
      const image = await this.httpService.downloadFile(
        file.url,
        handleDownloadProgress,
      );

      await this.fileService.updateFile(file.id, {
        status: FileStatusEnum.PROCESSING,
      });

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

  private async recognizeImageText(file: Buffer, lang: string) {
    const res = await recognize(file, lang);
    const {
      data: { text },
    } = res;
    return text;
  }
}
