import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'nestjs-prisma';
import { RoleEnum, Roles } from '@/auth/role.decorator';

@Injectable()
export class MenuService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    const { parentId, name, ...data } = createMenuDto;

    // 检查是否存在具有相同 name 的菜单项
    const existingMenu = await this.prismaService.menu.findUnique({
      where: { name },
    });

    if (existingMenu) {
      throw new ConflictException(`${name} 名称已存在`);
    }

    // 检查 parentId 是否存在
    if (parentId) {
      const parentMenu = await this.prismaService.menu.findUnique({
        where: { id: parentId },
      });

      if (!parentMenu) {
        throw new NotFoundException(`父级id ${parentId} 不存在`);
      }
    }

    return this.prismaService.menu.create({
      data: {
        name,
        ...data,
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
    });
  }

  // 递归获取菜单项的子菜单
  async getMenusWithChildren(menus) {
    return Promise.all(
      menus.map(async (menu) => {
        const children = await this.prismaService.menu.findMany({
          where: {
            parentId: menu.id,
          },
        });

        if (children.length > 0) {
          menu.children = await this.getMenusWithChildren(children);
        } else {
          menu.children = null;
        }
        return menu;
      }),
    );
  }

  async findAll() {
    const rootMenus = await this.prismaService.menu.findMany({
      where: {
        parentId: null,
      },
    });

    const menusWithChildren = await this.getMenusWithChildren(rootMenus);
    return menusWithChildren;
  }

  findOne(id: number) {
    return this.prismaService.menu.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return this.prismaService.menu.update({
      where: {
        id,
      },
      data: updateMenuDto,
    });
  }

  @Roles(RoleEnum.ADMIN)
  remove(id: number) {
    return this.prismaService.menu.delete({
      where: {
        id,
      },
    });
  }
}
