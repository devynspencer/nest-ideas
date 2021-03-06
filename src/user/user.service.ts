import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto, UserRo } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(page = 1): Promise<UserRo[]> {
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return users.map(user => user.toResponseObject(false));
  }

  async show(username: string): Promise<UserRo> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['ideas', 'bookmarks'],
    });

    return user.toResponseObject(false);
  }

  async login(data: UserDto): Promise<UserRo> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }

  async register(data: UserDto): Promise<UserRo> {
    const { username, password } = data;
    let user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      throw new HttpException(
        `User ${username} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    user = await this.userRepository.create({ username, password });
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
