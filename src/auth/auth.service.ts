import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  createUser(user: CreateUserDto) {
    return this.userService.create(user);
  }

  async validateUser(email: string, password: string) {
    return await this.userService.validateUser(email, password);
  }
}
