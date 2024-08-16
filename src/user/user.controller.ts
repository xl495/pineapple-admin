import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleEnum, Roles } from '@/auth/role.decorator';

import { Pagination } from '@/common/decorators/pagination.decorator';
import { UserPaginationDto } from './dto/user-pagination.dto';

@ApiTags('用户')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '请使用 /auth/register 代替注册',
    deprecated: true,
  })
  @Post()
  @Roles(RoleEnum.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  findAll(@Pagination(UserPaginationDto) paginationDto: UserPaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
