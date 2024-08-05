import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: '路由名称',
    example: 'Menu 1',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '名称',
    example: '名称',
  })
  @IsString()
  label: string;

  @ApiProperty({
    description: '路径',
    example: '/menu',
  })
  @IsString()
  path: string;

  @ApiProperty({
    description: '是否隐藏',
    example: false,
  })
  @IsBoolean()
  isHidden: boolean;

  @ApiProperty({
    description: '排序',
    example: 1,
  })
  @IsInt()
  sort: number;

  @ApiProperty({
    description: '父级 ID',
    example: null,
  })
  @IsInt()
  @IsOptional()
  parentId?: number | null;
}
