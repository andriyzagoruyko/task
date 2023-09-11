import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class EnqueueFileDto {
  @JoiSchema(Joi.number().required())
  fileId!: number;

  @JoiSchema(Joi.string().required())
  socketId!: string;
}
