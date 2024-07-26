import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

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

    return { ...payload, ...user };
  }
}
