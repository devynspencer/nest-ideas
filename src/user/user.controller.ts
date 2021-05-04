import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { ValidationPipe } from '../shared/validation.pipe';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { User } from './user.decorator';

@Controller()
export class UserController {
  private logger = new Logger('IdeaController');

  constructor(private userService: UserService) {}

  @Get('api/users')
  @UseGuards(new AuthGuard())
  showAllUsers(@User('id') user: number, @Query('page') page: number) {
    this.logger.log(`All users listed by user: ${user}`);
    return this.userService.showAll(page);
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDto) {
    this.logger.log(`User login: ${JSON.stringify(data)}`);
    return this.userService.login(data);
  }

  @Post('auth/register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDto) {
    this.logger.log(`User registered: ${JSON.stringify(data)}`);
    return this.userService.register(data);
  }
}
