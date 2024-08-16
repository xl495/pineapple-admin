import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Get()
  getRole() {
    return this.roleService.getList();
  }
}
