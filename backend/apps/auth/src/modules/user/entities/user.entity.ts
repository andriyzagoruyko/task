import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
@ObjectType()
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  username!: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  password!: string;
}
