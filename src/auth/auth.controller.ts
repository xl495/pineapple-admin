import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StatusCodes } from 'http-status-codes';
import { RefreshTokenDto } from './dto/refreshToken.dto';

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
  @HttpCode(StatusCodes.OK)
  async login(@Body() loginDto: LoginDto) {
    if (!loginDto.email || !loginDto.password) {
      throw new HttpException(
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: '邮箱或密码不能为空',
        },
        StatusCodes.OK,
      );
    }

    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new HttpException(
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: '账号密码错误',
        },
        StatusCodes.OK,
      );
    }

    const accessToken = this.authService.generateToken({
      userId: user.id,
      userEmail: user.email,
    });

    const refreshToken = this.authService.generateToken(
      {
        userId: user.id,
        userEmail: user.email,
      },
      {
        expiresIn: '1d',
      },
    );

    return {
      userInfo: user,
      accessToken,
      refreshToken,
    };
  }

  @Post('updateToken')
  @HttpCode(StatusCodes.OK)
  @Public()
  async updateToken(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto.refreshToken);
  }
}
