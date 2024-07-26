import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // 自定义错误信息
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: '未登录',
      });
    }
    return user;
  }
}
