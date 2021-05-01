import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
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
  showAllIdeas(@User() user) {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@Body() data: IdeaDto, @User() user) {
    this.logger.log(`Creating idea: ${JSON.stringify(data)}`);
    return this.ideaService.create(data);
  }

  @Get(':id')
  @UseGuards(new AuthGuard())
  readIdea(@Param('id') id: string, @User() user) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateIdea(
    @Param('id') id: string,
    @Body() data: Partial<IdeaDto>,
    @User() user,
  ) {
    this.logger.log(`Updating idea ${id}: ${JSON.stringify(data)}`);
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deleteidea(@Param('id') id: string, @User() user) {
    this.logger.log(`Deleting idea ${id}`);
    return this.ideaService.delete(id);
  }
}
