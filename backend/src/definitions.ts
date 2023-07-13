import * as path from 'path';

export const MIGRATION_TABLE_NAME = '__migrations';
export const ENTITIES_PATHS = [path.join(__dirname + '/**/*.entity.{ts,js}')];

export const RABBITMQ_QUEUE_NAME = 'queue';
export const RABBITMQ_IMAGE_TOPIC = 'image';
export const RABBITMQ_AUDIO_TOPIC = 'audio';
