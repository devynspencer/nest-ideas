import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
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
  showAllUsers(@Query('page') page: number) {
    return this.userService.showAll(page);
  }

  @Get('api/users/:username')
  showUser(@Param('username') username: string) {
    return this.userService.show(username);
  }

  @Get('auth/whoami')
  @UseGuards(new AuthGuard())
  showSelf(@User('username') username: string) {
    this.logger.log(`User lookup by: ${username}`);
    return this.userService.show(username);
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
