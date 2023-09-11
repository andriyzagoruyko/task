import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileStatusEnum } from '../enums/file-status.enum';
import { FileTypeEnum } from '../enums/file-type.enum';
import { Field, ObjectType, Int } from '@nestjs/graphql';

@Entity({ name: 'file' })
@ObjectType()
export class FileEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  status!: FileStatusEnum;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name!: string;

  @Column({ type: 'varchar', length: 30 })
  @Field()
  lang!: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  text!: string | null;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  url!: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  type!: FileTypeEnum;

  @Column({ type: 'integer', nullable: true })
  @Field(() => Int, { nullable: true })
  size!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  error!: string;

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

export type GroupedImageEntity = FileEntity & { count?: number };
