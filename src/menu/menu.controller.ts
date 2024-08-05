import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

@Controller('menu')
@ApiBearerAuth()
@ApiTags('菜单')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const menu = await this.menuService.findOne(+id);
    if (!menu) {
      throw new HttpException(
        {
          status: StatusCodes.NOT_FOUND,
          message: `菜单项 id ${id} 不存在`,
        },
        StatusCodes.NOT_FOUND,
      );
    }
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
