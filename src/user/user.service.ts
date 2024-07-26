import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
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
        StatusCodes.CONFLICT,
      );
    }

    const { password, ...data } = createUserDto;

    const rounds = this.configService.get('BCRYPT_ROUNDS') || 10;

    const salt = genSaltSync(Number(rounds));

    const hashedPassword = hashSync(password, salt);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        roles: true,
      },
    });
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
        StatusCodes.NOT_FOUND,
      );
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
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
        StatusCodes.NOT_FOUND,
      );
    }

    if (!compareSync(password, user.password)) {
      throw new HttpException(
        {
          status: StatusCodes.CONFLICT,
          message: '密码错误',
          data: null,
        },
        StatusCodes.CONFLICT,
      );
    }
    return user;
  }
}
