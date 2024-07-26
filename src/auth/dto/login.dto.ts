import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '邮箱',
    example: '123456',
  })
  email: string;
  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  password: string;
}
