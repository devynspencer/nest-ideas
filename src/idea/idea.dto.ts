import { IsString } from 'class-validator';
import { UserRo } from '../user/user.dto';

export class IdeaDto {
  @IsString()
  idea: string;

  @IsString()
  description: string;
}

export interface IdeaRo {
  id?: string;
  created: Date;
  updated: Date;
  idea: string;
  description: string;
  author: UserRo;
  upvotes?: number;
  downvotes?: number;
}
