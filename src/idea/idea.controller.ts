import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('api/idea')
export class IdeaController {
  private logger = new Logger('IdeaController');

  constructor(private ideaService: IdeaService) {}

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createIdea(@Body() data: IdeaDto) {
    this.logger.log(`Creating idea: ${JSON.stringify(data)}`);
    return this.ideaService.create(data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDto>) {
    this.logger.log(`Updating idea ${id}: ${JSON.stringify(data)}`);
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  deleteidea(@Param('id') id: string) {
    this.logger.log(`Deleting idea ${id}`);
    return this.ideaService.delete(id);
  }
}
