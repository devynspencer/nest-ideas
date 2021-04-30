import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  private get token() {
    const { id, username } = this;

    return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '7d' });
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(includeToken = true) {
    const { id, created, username, token } = this;
    const responseObject = { id, created, username, token };

    if (includeToken) {
      responseObject.token = token;
    }

    return responseObject;
  }
}
