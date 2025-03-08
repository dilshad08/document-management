// create-user.dto.ts

import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum Role {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsString()
  @IsNotEmpty()
  role: string;
}
