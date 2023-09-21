import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileTypeEnum } from '../enums/file-type.enum';
import { Field, ObjectType, Int, ID, Directive } from '@nestjs/graphql';

@Entity({ name: 'file' })
@ObjectType()
@Directive('@key(fields: "id")')
export class FileEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name!: string;

  @Column({ type: 'varchar', length: 30 })
  @Field()
  lang!: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  url!: string;

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  type!: FileTypeEnum;

  @Column({ type: 'integer', nullable: true })
  @Field(() => Int, { nullable: true })
  size!: number;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  @Field()
  createdAt!: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  @Field()
  updatedAt!: string;
}
