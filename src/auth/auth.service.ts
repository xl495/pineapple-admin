import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  createUser(user: CreateUserDto) {
    return this.userService.create(user);
  }

  async validateUser(email: string, password: string) {
    return await this.userService.validateUser(email, password);
  }

  generateToken(sign: any, options: JwtSignOptions = {}): string {
    return this.jwtService.sign(sign, {
      secret: this.configService.get('JWT_SECRET'),
      ...options,
    });
  }

  async refreshToken(token: string) {
    const result = await this.jwtService.verify(token);

    if (result.userId) {
      const accessToken = this.generateToken({
        userId: result.userId,
        userEmail: result.userEmail,
      });

      const refreshToken = this.generateToken(
        {
          userId: result.userId,
          userEmail: result.userEmail,
        },
        {
          expiresIn: '1d',
        },
      );

      return {
        accessToken,
        refreshToken,
      };
    }

    return null;
  }
}
