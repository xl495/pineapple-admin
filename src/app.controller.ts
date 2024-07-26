import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiProperty({ description: 'Hello World' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
