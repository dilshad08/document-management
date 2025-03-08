import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDataDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Response data', type: LoginResponseDataDto })
  data: LoginResponseDataDto;
}
