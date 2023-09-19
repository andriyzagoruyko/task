import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { recognize } from 'tesseract.js';
import { RecognitionTaskService } from '../services/recognition-task.service';
import * as _ from 'lodash';
import { RABBITMQ_IMAGE_TOPIC } from '@app/shared/definitions';
import { QueueRoutesEnum } from '@app/shared/queue/enums/queue-routes.enum';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { EnqueueFileDto } from '@app/shared/queue/dto/enqueue-file.dto';
import { HttpService } from '../../http/http.service';

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
        await this.recognitionTaskService.update(fileId, {
          progress,
        });
      }, 100);

      const image = await this.httpService.downloadFile(
        url,
        handleDownloadProgress,
      );

      await this.recognitionTaskService.update(fileId, {
        status: TaskStatusEnum.PROCESSING,
      });

      this.logger.log(`Recognizing text`);

      const result = await this.recognizeImageText(image, lang);
      await this.recognitionTaskService.update(fileId, {
        status: TaskStatusEnum.READY,
        result,
      });

      this.logger.log(`Text recognized successfully:\n${result}`);
    } catch (e) {
      const error = String(e);
      await this.recognitionTaskService.update(fileId, {
        status: TaskStatusEnum.FAILED,
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
