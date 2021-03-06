import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRo } from './user.dto';
import { IdeaEntity } from '../idea/idea.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  // eslint-disable-next-line
  @OneToMany(type => IdeaEntity, idea => idea.author)
  ideas: IdeaEntity[];

  // eslint-disable-next-line
  @ManyToMany(type => IdeaEntity, { cascade: true })
  @JoinTable()
  bookmarks: IdeaEntity[];

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

  toResponseObject(includeToken = true): UserRo {
    const { id, created, updated, username, token } = this;
    const responseObject: UserRo = { id, created, updated, username };

    if (includeToken) {
      responseObject.token = token;
    }

    if (this.ideas) {
      responseObject.ideas = this.ideas;
    }

    if (this.bookmarks) {
      responseObject.bookmarks = this.bookmarks;
    }

    return responseObject;
  }
}
