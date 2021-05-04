import { IsNotEmpty } from 'class-validator';
import { IdeaEntity } from '../idea/idea.entity';

export class UserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export interface UserRo {
  id: string;
  created: Date;
  updated: Date;
  username: string;
  token?: string;
  ideas?: IdeaEntity[];
  bookmarks?: IdeaEntity[];
}
