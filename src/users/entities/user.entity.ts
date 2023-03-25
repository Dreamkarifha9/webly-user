import { BasicData } from '../../shared/entities';
import * as bcrypt from 'bcrypt';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('users', { schema: 'user' })
export class User extends BasicData {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: true, type: 'varchar' })
  firstName: string;

  @Column({ nullable: true, type: 'varchar' })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true, select: false })
  salt?: string;

  private tmpPassword?: string;

  @AfterLoad()
  private loadTmpPassword?(): void {
    this.tmpPassword = this.password;
  }

  @BeforeInsert()
  private async hashPasswordHook?(): Promise<void> {
    console.log('BeforeInsert:', this.tmpPassword, this.password);
    if (this.password) {
      this.salt = await bcrypt.genSalt();
      this.password = await this.hashPassword(this.password, this.salt);
    }
  }

  @BeforeUpdate()
  private async encryptPassword?(): Promise<void> {
    console.log('BeforeUpdate: display', this.tmpPassword, this.password);
    if (this.tmpPassword !== this.password) {
      this.salt = await bcrypt.genSalt();
      this.password = await this.hashPassword(this.password, this.salt);
    }
  }

  public hashPassword?(pwd: string, salt: string): Promise<string> {
    return bcrypt.hash(pwd, salt);
  }
}
