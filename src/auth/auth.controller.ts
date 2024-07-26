import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  @Public()
  register(@Body() user: CreateUserDto) {
    return this.authService.createUser(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('local-login')
  @ApiBody({
    type: LoginDto,
  })
  @Public()
  async localLogin(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      return {
        msg: '账号密码错误',
      };
    }
    return {
      user: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      return {
        msg: '账号密码错误',
      };
    }

    const token = this.jwtService.sign(
      {
        userId: user.id,
        userEmail: user.email,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );

    return {
      user: user,
      token,
    };
  }
}
