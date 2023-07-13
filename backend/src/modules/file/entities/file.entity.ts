import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileStatusEnum } from '../enums/file-status.enum';
import { FileTypeEnum } from '../enums/file-type.enum';

@Entity({ name: 'file' })
export class FileEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  status!: FileStatusEnum;

  @Column({ type: 'varchar', length: 30 })
  lang!: string;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'varchar', length: 255 })
  url!: FileStatusEnum;

  @Column({ type: 'varchar', length: 255 })
  type!: FileTypeEnum;

  @Column({ type: 'integer' })
  size!: number;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt!: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updatedAt!: string;
}

export type GroupedImageEntity = FileEntity & { count?: number };
