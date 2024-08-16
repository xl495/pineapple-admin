import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  getList() {
    return this.prismaService.role.findMany();
  }
}
