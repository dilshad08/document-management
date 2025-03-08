import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

export class UpdateRoleDto {
  @ApiProperty({ example: '' })
  @IsEnum(Role)
  @IsString()
  @IsNotEmpty()
  role: string;
}
