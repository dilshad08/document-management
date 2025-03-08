import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum Role {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

export class UpdateRoleDto {
  @IsEnum(Role)
  @IsString()
  @IsNotEmpty()
  role: string;
}
