import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { StatusCodes } from 'http-status-codes';
import { UserEnum } from '@/enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: {
    userId: number;
    nickName: string;
    iat: number;
    exp: number;
  }): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return null;
    }

    if (user.status === UserEnum.status.DISABLED) {
      throw new HttpException(
        {
          status: StatusCodes.FORBIDDEN,
          message: '用户已被禁用',
          data: null,
        },
        StatusCodes.OK,
      );
    }

    if (user.status === UserEnum.status.INACTIVE) {
      throw new HttpException(
        {
          status: StatusCodes.FORBIDDEN,
          message: '用户未激活',
          data: null,
        },
        StatusCodes.OK,
      );
    }

    return { ...payload, ...user };
  }
}
