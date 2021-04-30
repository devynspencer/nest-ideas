import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';

@Module({
  controllers: [IdeaController],
  providers: [],
})
export class IdeaModule {}
