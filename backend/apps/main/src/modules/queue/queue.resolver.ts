import { Resolver } from '@nestjs/graphql';
import { Subscription } from '@nestjs/graphql';
import { RecognitionTaskEntity } from '../queue/entities/recognition-task.entity';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

export const RECOGNITION_TASK_UPDATED = 'taskU';

@Resolver()
export class QueueResolver {}
