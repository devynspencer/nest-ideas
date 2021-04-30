import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('idea')
export class IdeaController {
  @Get()
  showAllIdeas() {

  }

  @Post()
  createIdea() {

  }

  @Get(':id')
  readIdea() {

  }

  @Put(':id')
  updateIdea() {

  }

  @Delete(':id')
  deleteidea() {

  }
}
