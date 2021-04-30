import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user')
  showAllUsers() {
    this.userService.showAll();
  }

  @Post('login')
  login(@Body() data) {
    this.userService.login(data);
  }

  @Post('register')
  register(@Body() data) {
    this.userService.register(data);
  }
}
