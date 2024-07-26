import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'user',
    default: 'user',
  })
  @IsString()
  name: string;

  @ApiProperty({
    default: 'nick name',
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'xx@admin.com',
    default: 'xx@admin.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '123456',
    default: '123456',
  })
  @IsString()
  password: string;
}
