import { Body, Controller, Get, Logger, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../shared/validation.pipe';
import { UserService } from './user.service';

@Controller()
export class UserController {
  private logger = new Logger('IdeaController');

  constructor(private userService: UserService) {}

  @Get('user')
  showAllUsers() {
    return this.userService.showAll();
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data) {
    this.logger.log(`User login: ${JSON.stringify(data)}`);
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data) {
    this.logger.log(`User registered: ${JSON.stringify(data)}`);
    return this.userService.register(data);
  }
}
