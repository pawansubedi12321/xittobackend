import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export class GenericEntity {
  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn()
  deleted_at: Date;

  @Exclude()
  @Column()
  created_by: string;

  @Exclude()
  @Column()
  updated_by: string;
}
