import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadDto {
  // 这里
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
