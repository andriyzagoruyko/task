import * as Joi from 'joi';
//import { JoiSchema } from 'nestjs-joi';

export class EnqueueFileDto {
  //@JoiSchema(Joi.number().required())
  fileId!: number;

  url!: string;

  lang!: string;
}
