import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
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
  login(@Body() data) {
    this.logger.log(`User login: ${JSON.stringify(data)}`);
    return this.userService.login(data);
  }

  @Post('register')
  register(@Body() data) {
    this.logger.log(`User registered: ${JSON.stringify(data)}`);
    return this.userService.register(data);
  }
}
