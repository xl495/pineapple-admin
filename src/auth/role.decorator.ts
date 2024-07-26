import { SetMetadata } from '@nestjs/common';

/** 角色枚举 */
export enum RoleEnum {
  /** 普通用户 */
  USER = 'USER',
  /** 管理员 */
  ADMIN = 'ADMIN',
}

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
