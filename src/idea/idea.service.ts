import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRo } from '../user/user.dto';
import { UserEntity } from '../user/user.entity';
import { IdeaDto, IdeaRo } from './idea.dto';
import { IdeaEntity } from './idea.entity';
import { Vote } from '../shared/vote.enum';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(): Promise<IdeaRo[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });

    return ideas.map(idea => this.toResponseObject(idea));
  }

  async create(userId: string, data: IdeaDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = await this.ideaRepository.create({ ...data, author: user });

    await this.ideaRepository.save(idea);
    return this.toResponseObject(idea);
  }

  async read(id: string): Promise<IdeaRo> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return this.toResponseObject(idea);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<IdeaDto>,
  ): Promise<IdeaRo> {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    this.verifyOwnership(idea, userId);

    await this.ideaRepository.update({ id }, data);

    idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });
    return this.toResponseObject(idea);
  }

  async delete(id: string, userId: string): Promise<IdeaRo> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    this.verifyOwnership(idea, userId);

    await this.ideaRepository.delete({ id });
    return this.toResponseObject(idea);
  }

  private toResponseObject(idea: IdeaEntity): IdeaRo {
    const responseObject: any = {
      ...idea,
      author: idea.author.toResponseObject(false),
    };

    if (responseObject.upvotes) {
      responseObject.upvotes = idea.upvotes.length;
    }

    if (responseObject.downvotes) {
      responseObject.downvotes = idea.downvotes.length;
    }

    return responseObject;
  }

  private verifyOwnership(idea: IdeaEntity, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }

  async bookmark(id: string, userId: string): Promise<UserRo> {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
      user.bookmarks.push(idea);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'Idea already bookmarked',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject(false);
  }

  async unbookmark(id: string, userId: string): Promise<UserRo> {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== idea.id,
      );
      await this.userRepository.save(user);
    } else {
      throw new HttpException('Idea not bookmarked', HttpStatus.BAD_REQUEST);
    }

    return user.toResponseObject(false);
  }

  async upvote(id: string, userId: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    idea = await this.vote(idea, user, Vote.UP);
    return this.toResponseObject(idea);
  }

  async downvote(id: string, userId: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    idea = await this.vote(idea, user, Vote.DOWN);
    return this.toResponseObject(idea);
  }

  private async vote(idea: IdeaEntity, user: UserEntity, vote: Vote) {
    const opposite = vote === Vote.UP ? Vote.DOWN : Vote.UP;

    if (
      // User has voted already
      idea[vote].some(voter => voter.id === user.id) ||
      idea[opposite].some(voter => voter.id === user.id)
    ) {
      // Remove existing vote
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
      await this.ideaRepository.save(idea);

      // User hasn't voted yet
    } else if (!idea[vote].some(voter => voter.id === user.id)) {
      idea[vote].push(user);
      await this.ideaRepository.save(idea);
    } else {
      throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
    }

    return idea;
  }
}
