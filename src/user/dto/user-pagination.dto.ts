import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { IsOptional } from 'class-validator';

export class UserPaginationDto extends PartialType(PaginationDto) {
  @ApiProperty({
    description: '邮箱',
  })
  @IsOptional()
  email?: string;
  @ApiProperty({
    description: '昵称',
  })
  @IsOptional()
  nickName?: string;
}
