import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EnqueueFileDto } from './dto/enqueue-file.dto';

@Injectable()
export class QueueService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  enqueueFile(data: EnqueueFileDto) {
    console.log(data);
    this.amqpConnection.publish<EnqueueFileDto>('image', 'test', data);
  }

  @RabbitSubscribe({ exchange: 'image', routingKey: 'test' })
  test(msg) {
    console.log('-----------', msg);
  }
}
