import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { IdeaDto } from './idea.dto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll() {
    return await this.ideaRepository.find();
  }

  async create(userId: string, data: IdeaDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = await this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(idea);
    return { ...idea, author: idea.author.toResponseObject() };
  }

  async read(id: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return idea;
  }

  async update(id: string, data: Partial<IdeaDto>) {
    let idea = await this.ideaRepository.findOne({ where: { id } });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.update({ id }, data);

    idea = await this.ideaRepository.findOne({ where: { id } });

    return idea;
  }

  async delete(id: string) {
    const idea = this.ideaRepository.findOne({ where: { id } });

    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.delete({ id });
    return idea;
  }
}
