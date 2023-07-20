import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';
import { AVAILABLE_LANGUAGES } from 'src/definitions';

export class EnqueueFileDto {
  @JoiSchema(Joi.string().required())
  fileUrl!: string;

  @JoiSchema(
    Joi.string()
      .required()
      .valid(...AVAILABLE_LANGUAGES),
  )
  lang!: string;

  @JoiSchema(Joi.string().required())
  userId!: string;
}
