import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BasicData {
  @Column({ nullable: true, default: true })
  active?: boolean;

  @Column({ nullable: true, default: false })
  deleted?: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;

  @Column({ nullable: true })
  updatedBy?: string;
}
