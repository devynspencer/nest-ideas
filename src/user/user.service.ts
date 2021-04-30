import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll() {
    const users = await this.userRepository.find();
  }

  async login(data) {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || (await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }

  async register(data) {
    const { username } = data;
    let user: any = await this.userRepository.findOne({ where: { username } });

    if (user) {
      throw new HttpException(
        `User ${username} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
