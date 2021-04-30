import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export interface UserRo {
  id: string;
  username: string;
  created: Date;
  token?: string;
}