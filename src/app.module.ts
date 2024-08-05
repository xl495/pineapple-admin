import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './auth/role.guard';
import { MenuModule } from './menu/menu.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return {
          global: true,
          secret,
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    MenuModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../uploads'),
      serveRoot: '/uploads', // 需要添加'/' 此处相当于添加前缀
    }),
    UploadModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [ConfigModule, PrismaModule, UserModule],
})
export class AppModule {}
