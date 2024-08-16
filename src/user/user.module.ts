import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PaginationService } from '@/common/services/pagination.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PaginationService],
  exports: [UserService],
})
export class UserModule {}
