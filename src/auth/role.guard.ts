import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleEnum, ROLES_KEY } from './role.decorator';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRoles: string[] = [];
    if (Array.isArray(user.roles)) {
      userRoles.push(...user.roles.map((role) => role.name));
    }

    if (!requiredRoles.some((role) => userRoles.includes(role))) {
      throw new HttpException(
        {
          status: StatusCodes.FORBIDDEN,
          message: '无权限',
        },
        StatusCodes.OK,
      );
    }

    return true;
  }
}
