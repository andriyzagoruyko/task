import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RABBITMQ_IMAGE_TOPIC } from '../../../definitions';
import { QueueRoutesEnum } from '../enums/queue-routes.enum';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { FileStatusEnum } from '../../../modules/file/enums/file-status.enum';
import { recognize } from 'tesseract.js';
import { HttpService } from '../../../modules/http/http.service';
import { RecognitionTaskService } from '../services/recognition-task.service';
import * as _ from 'lodash';

@Injectable()
export class ImageProcessingConsumer {
  logger = new Logger(ImageProcessingConsumer.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly recognitionTaskService: RecognitionTaskService,
  ) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_IMAGE_TOPIC,
    routingKey: QueueRoutesEnum.RECOGNIZE_IMAGE,
  })
  async processImageEvent({ fileId, url, lang }: EnqueueFileDto) {
    this.recognitionTaskService.create({ fileId });
    try {
      this.logger.log(`Downloading file ${url}`);
      const handleDownloadProgress = _.throttle(async (progress: number) => {
        await this.recognitionTaskService.updateOneByFileId(fileId, {
          progress,
        });
      }, 100);

      const image = await this.httpService.downloadFile(
        url,
        handleDownloadProgress,
      );

      await this.recognitionTaskService.updateOneByFileId(fileId, {
        status: FileStatusEnum.PROCESSING,
      });

      this.logger.log(`Recognizing text`);

      const result = await this.recognizeImageText(image, lang);
      await this.recognitionTaskService.updateOneByFileId(fileId, {
        status: FileStatusEnum.READY,
        result,
      });

      this.logger.log(`Text recognized successfully:\n${result}`);
    } catch (e) {
      const error = String(e);
      await this.recognitionTaskService.updateOneByFileId(fileId, {
        status: FileStatusEnum.FAILED,
        error,
      });
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
