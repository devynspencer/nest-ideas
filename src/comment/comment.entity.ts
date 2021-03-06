import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IdeaEntity } from '../idea/idea.entity';
import { UserEntity } from '../user/user.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  body: string;

  // eslint-disable-next-line
  @ManyToOne(type => UserEntity)
  @JoinTable()
  author: UserEntity;

  // eslint-disable-next-line
  @ManyToOne(type => IdeaEntity, idea => idea.comments)
  idea: IdeaEntity;
}
