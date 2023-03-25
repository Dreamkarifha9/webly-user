import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { BasicData } from './basic-data.entity';

export abstract class MasterGeneratedData extends BasicData {
  @PrimaryGeneratedColumn({ type: 'int8' })
  code: number;

  @Column({ nullable: false })
  text: string;

  @Column({ type: 'text', nullable: true })
  remark?: string;
}
