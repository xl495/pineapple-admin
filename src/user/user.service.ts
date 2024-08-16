import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { StatusCodes } from 'http-status-codes';
import { PaginationService } from '@/common/services/pagination.service';
import { UserPaginationDto } from './dto/user-pagination.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private paginationService: PaginationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // 查找用户是否存在
    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
      include: {
        roles: true,
      },
    });

    if (user) {
      throw new HttpException(
        {
          status: StatusCodes.CONFLICT,
          message: '用户已存在',
          data: null,
        },
        StatusCodes.OK,
      );
    }

    const { password, ...data } = createUserDto;

    const rounds = this.configService.get('BCRYPT_ROUNDS') || 10;

    const salt = genSaltSync(Number(rounds));

    const hashedPassword = hashSync(password, salt);

    if (data.roleList) {
      data['roles'] = {
        connect: data.roleList.map((item) => {
          return {
            name: item,
          };
        }),
      };
      delete data.roleList;
    }

    const createUser = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return {
      code: 0,
      data: createUser,
      message: '创建成功',
    };
  }

  async findAll(paginationDto: UserPaginationDto) {
    const { skip, take } =
      this.paginationService.getPaginationOptions(paginationDto);

    const users = await this.prisma.user.findMany({
      where: {
        email: {
          contains: paginationDto.email,
        },
        nickName: {
          contains: paginationDto.nickName,
        },
      },
      skip,
      take,
      include: {
        roles: true,
      },
    });

    const totalCount = await this.prisma.user.count();

    const paginationMeta = this.paginationService.createPaginationMeta(
      totalCount,
      paginationDto,
    );

    return {
      ...paginationMeta,
      list: users,
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: StatusCodes.NOT_FOUND,
          message: '用户不存在',
          data: null,
        },
        StatusCodes.OK,
      );
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    delete updateUserDto.password;
    delete (updateUserDto as any).id;
    if (updateUserDto.roleList) {
      updateUserDto['roles'] = {
        set: updateUserDto.roleList.map((item) => ({
          name: item,
        })),
      };
      delete updateUserDto.roleList;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        roles: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // 验证用户
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roles: true,
      },
    });
    if (!user) {
      throw new HttpException(
        {
          status: StatusCodes.NOT_FOUND,
          message: '用户不存在',
          data: null,
        },
        StatusCodes.OK,
      );
    }

    if (!compareSync(password, user.password)) {
      throw new HttpException(
        {
          status: StatusCodes.CONFLICT,
          message: '密码错误',
          data: null,
        },
        StatusCodes.OK,
      );
    }
    return user;
  }
}
