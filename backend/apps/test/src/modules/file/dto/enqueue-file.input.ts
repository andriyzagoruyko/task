import * as Joi from 'joi';
//import { JoiSchema } from 'nestjs-joi';
import { AVAILABLE_LANGUAGES } from 'src/definitions';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class EnqueueFileInput {
  // @JoiSchema(Joi.string().required())
  @Field()
  url!: string;

  /*@JoiSchema(
    Joi.string()
      .required()
      .valid(...AVAILABLE_LANGUAGES),
  )*/
  @Field()
  lang!: string;
}