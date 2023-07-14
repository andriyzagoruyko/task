import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RABBITMQ_AUDIO_TOPIC } from 'src/definitions';
import { EnqueueFileDto } from '../dto/enqueue-file.dto';
import { FileService } from 'src/modules/file/file.service';
import { FileTypeEnum } from 'src/modules/file/enums/file-type.enum';
import { FileStatusEnum } from 'src/modules/file/enums/file-status.enum';
import { AudioRoutesEnum } from '../enums/audio-routes.enum';

@Injectable()
export class AudioProcessingConsumer {
  logger = new Logger(AudioProcessingConsumer.name);

  constructor(private readonly fileService: FileService) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_AUDIO_TOPIC,
    routingKey: AudioRoutesEnum.RECOGNIZE,
  })
  async processAudioEvent({ fileUrl, lang }: EnqueueFileDto) {
    const name = this.fileService.getFileName(fileUrl);
    const file = await this.fileService.createFileEntity({
      name,
      lang,
      url: fileUrl,
      type: FileTypeEnum.AUDIO,
      status: FileStatusEnum.QUEUED,
    });
    try {
      await this.fileService.fileExists(fileUrl);
      const size = await this.fileService.getFileSize(fileUrl);
      await this.fileService.updateFileEntity(file.id, { name, size });
    } catch (e) {
      const error = String(e);
      await this.fileService.updateFileEntity(file.id, { error });
      this.logger.error(`Exception occurred during processing audio: ${error}`);
    }
  }
}