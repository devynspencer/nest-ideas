import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';
import { CommentDto } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('api/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('idea/:id')
  showCommentsByIdea(@Param('id') idea: string) {}

  @Get('user/:id')
  showCommentsByUser(@Param('id') user: string) {}

  @Get(':id')
  showComment(@Param('id') id: string) {}

  @Post('idea/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createComment(
    @Param('id') idea: string,
    @User('id') user: string,
    @Body() data: CommentDto,
  ) {}

  @Delete('idea/:id')
  @UserGuards(new AuthGuard())
  deleteComment(@Param('id') id: string, @User('id') user: string) {}
}
