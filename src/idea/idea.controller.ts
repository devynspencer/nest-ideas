import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';

@Controller('idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  createIdea(@Body() data: IdeaDto) {
    Logger.log(`Creating idea: ${JSON.stringify(data)}`, 'Idea');
    return this.ideaService.create(data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDto>) {
    Logger.log(`Updating idea ${id}: ${JSON.stringify(data)}`, 'Idea');
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  deleteidea(@Param('id') id: string) {
    return this.ideaService.delete(id);
  }
}
