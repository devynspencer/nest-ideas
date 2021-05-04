import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity } from '../idea/idea.entity';
import { UserEntity } from '../user/user.entity';
import { CommentDto } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,

    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async show(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'idea'],
    });

    return this.toResponseObject(comment);
  }

  async showByIdea(ideaId: string, page = 1) {
    const comments = await this.commentRepository.find({
      where: { idea: { id: ideaId } },
      relations: ['author', 'idea'],
      take: 25,
      skip: 25 * (page - 1),
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async showByUser(userId: string, page = 1) {
    const comments = await this.commentRepository.find({
      where: { author: userId },
      relations: ['author'],
      take: 25,
      skip: 25 * (page - 1),
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  async create(ideaId: string, userId: string, data: CommentDto) {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const comment = await this.commentRepository.create({
      ...data,
      idea,
      author: user,
    });

    await this.commentRepository.save(comment);
    return this.toResponseObject(comment);
  }

  async delete(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'idea'],
    });

    if (comment.author.id !== userId) {
      throw new HttpException(
        'You are not the author of this comment',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.commentRepository.remove(comment);
    return comment;
  }

  private toResponseObject(comment: CommentEntity) {
    const responseObject: any = comment;

    if (comment.author) {
      responseObject.author = comment.author.toResponseObject(false);
    }

    return responseObject;
  }
}
