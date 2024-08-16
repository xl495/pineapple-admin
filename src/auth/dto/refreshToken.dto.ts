import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: '刷新 token ',
    example: 'xxx',
  })
  refreshToken: string;
}
