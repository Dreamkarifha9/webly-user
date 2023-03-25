import { PrimaryColumn, Column } from 'typeorm';
import { BasicData } from './basic-data.entity';

export abstract class MasterData extends BasicData {
  @PrimaryColumn({ type: 'int8' })
    code: number;

  @Column({ nullable: false })
    text: string;

  @Column({ type: 'text', nullable: true })
    remark?: string;
}
