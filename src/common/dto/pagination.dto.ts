import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: '页码',
    example: 1,
    default: 1,
  })
  @IsOptional()
  page?: number | string = 1;
  @ApiProperty({
    description: '每页数量',
    example: 10,
    default: 10,
  })
  @IsOptional()
  limit?: number | string = 10;
}
