import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDictDto {
  @ApiProperty({
    description: '是否是根节点',
    enum: [0, 1],
  })
  @IsInt()
  isRoot: 0 | 1;
  @ApiProperty({
    description: '字典名称',
  })
  @IsString()
  code: string;
  @ApiProperty({
    description: '字典标签',
  })
  @IsString()
  label: string;
  @ApiProperty({
    description: '字典标签',
  })
  @IsInt()
  @IsOptional()
  value?: number;
}
