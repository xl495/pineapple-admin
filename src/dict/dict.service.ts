import { Injectable } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class DictService {
  constructor(private prisma: PrismaService) {}
  async create(createDictDto: CreateDictDto) {
    return {
      code: 0,
      data: await this.prisma.dict.create({
        data: createDictDto,
      }),
      message: 'success',
    };
  }

  async findAll(code?: string) {
    const where = code
      ? { code, isRoot: 0 }
      : {
          isRoot: 1,
        };
    const result = await this.prisma.dict.findMany({
      where,
    });
    return {
      code: 0,
      data: result,
      message: 'success',
    };
  }

  findOne(id: number) {
    return {
      code: 0,
      data: this.prisma.dict.findUnique({
        where: {
          id,
        },
      }),
      message: 'success',
    };
  }

  update(id: number, updateDictDto: UpdateDictDto) {
    return {
      code: 0,
      data: this.prisma.dict.update({
        where: {
          id,
        },
        data: updateDictDto,
      }),
      message: 'success',
    };
  }

  async remove(id: number) {
    // 查找字典是否为根节点
    const dict = await this.prisma.dict.findUnique({
      where: {
        id,
      },
    });

    if (dict.isRoot === 1) {
      // 删除根节点时，同时删除子节点
      await this.prisma.dict.deleteMany({
        where: {
          code: dict.code,
        },
      });
    }

    const result = await this.prisma.dict.delete({
      where: {
        id,
      },
    });

    return {
      code: 0,
      data: result,
      message: '删除成功',
    };
  }
}
