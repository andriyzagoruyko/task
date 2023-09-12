import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { ImageRoutesEnum } from '../enums/image-routes.enum';
import { RABBITMQ_AUDIO_TOPIC, RABBITMQ_IMAGE_TOPIC } from 'src/definitions';
import { AudioRoutesEnum } from '../enums/audio-routes.enum';
import { RecognitionTaskService } from './recognition-task.service';

@Injectable()
export class QueueService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly recognitionTaskService: RecognitionTaskService,
  ) {}

  async publishImageRecognitionTask(fileId: number, socketId: string) {
    await this.recognitionTaskService.create({ fileId, progress: 0 });
    await this.amqpConnection.publish<EnqueueFileDto>(
      RABBITMQ_IMAGE_TOPIC,
      ImageRoutesEnum.RECOGNIZE,
      { fileId, socketId },
    );
  }

  async publishAudioRecognitionTask(fileId: number, socketId: string) {
    await this.recognitionTaskService.create({ fileId, progress: 0 });
    await this.amqpConnection.publish<EnqueueFileDto>(
      RABBITMQ_AUDIO_TOPIC,
      AudioRoutesEnum.RECOGNIZE,
      { fileId, socketId },
    );
  }
}
