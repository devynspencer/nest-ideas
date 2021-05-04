import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { UserEntity } from '../user/user.entity';

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn('')
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;

  // eslint-disable-next-line
  @ManyToOne(type => UserEntity, author => author.ideas)
  author: UserEntity;

  // eslint-disable-next-line
  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  upvotes: UserEntity[];

  // eslint-disable-next-line
  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  downvotes: UserEntity[];

  // eslint-disable-next-line
  @OneToMany(type => CommentEntity, comment => comment.idea, { cascade: true })
  comments: CommentEntity[];
}
