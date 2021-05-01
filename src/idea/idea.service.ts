import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { IdeaDto, IdeaRo } from './idea.dto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(): Promise<IdeaRo[]> {
    const ideas = await this.ideaRepository.find({ relations: ['author'] });

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
      relations: ['author'],
    });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return this.toResponseObject(idea);
  }

  async update(id: string, userId: string, data: Partial<IdeaDto>): Promise<IdeaRo> {
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
      relations: ['author'],
    });
    return this.toResponseObject(idea);
  }

  async delete(id: string, userId: string): Promise<IdeaRo> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    this.verifyOwnership(idea, userId);

    await this.ideaRepository.delete({ id });
    return this.toResponseObject(idea);
  }

  private toResponseObject(idea: IdeaEntity): IdeaRo {
    return { ...idea, author: idea.author.toResponseObject(false) };
  }

  private verifyOwnership(idea: IdeaEntity, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }
}
