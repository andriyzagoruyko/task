import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class EnqueueFileDto {
  @JoiSchema(Joi.string().required())
  fileUrl!: string;

  @JoiSchema(Joi.string().required())
  lang!: string;
}
