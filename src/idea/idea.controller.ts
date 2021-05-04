import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { User } from '../user/user.decorator';
import { AuthGuard } from '../shared/auth.guard';

@Controller('api/ideas')
export class IdeaController {
  private logger = new Logger('IdeaController');

  constructor(private ideaService: IdeaService) {}

  @Get()
  @UseGuards(new AuthGuard())
  showAllIdeas(@User('id') user: string, @Query('page') page: number) {
    this.logData({ user });
    return this.ideaService.showAll(page);
  }

  @Get('/latest')
  showLatestIdeas(@Query('page') page: number) {
    return this.ideaService.showAll(page, true);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@Body() data: IdeaDto, @User('id') user: string) {
    this.logData({ user, data });
    return this.ideaService.create(user, data);
  }

  @Get(':id')
  @UseGuards(new AuthGuard())
  readIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ user, id });
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateIdea(
    @Param('id') id: string,
    @Body() data: Partial<IdeaDto>,
    @User('id') user: string,
  ) {
    this.logData({ user, data, id });
    return this.ideaService.update(id, user, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deleteIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ user, id });
    return this.ideaService.delete(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmark(@Param('id') id: string, @User('id') user: string) {
    this.logData({ user, id });
    return this.ideaService.bookmark(id, user);
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  unbookmark(@Param('id') id: string, @User('id') user: string) {
    this.logData({ user, id });
    return this.ideaService.unbookmark(id, user);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  upvote(@Param('id') id: string, @User('id') user: string) {
    this.logData({ user, id });
    return this.ideaService.upvote(id, user);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  downvote(@Param('id') id: string, @User('id') user: string) {
    this.logData({ user, id });
    return this.ideaService.downvote(id, user);
  }

  private logData(options: any) {
    options.user && this.logger.log(`User: ${JSON.stringify(options.user)}`);
    options.body && this.logger.log(`Data: ${JSON.stringify(options.body)}`);
    options.id && this.logger.log(`Idea: ${JSON.stringify(options.id)}`);
  }
}
