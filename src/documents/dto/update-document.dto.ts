import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
}
