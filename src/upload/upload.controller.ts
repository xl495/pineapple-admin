import {
  Body,
  Controller,
  HttpException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateUploadDto } from './dto/create-upload.dto';

@Controller('upload')
@ApiTags('上传')
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  uploadFile(@UploadedFile() file, @Body() fileInfo: CreateUploadDto) {
    console.log(fileInfo);
    if (!file) {
      throw new HttpException(
        {
          status: 400,
          message: 'No file uploaded!',
        },
        400,
      );
    }
    return {
      message: 'File uploaded successfully!',
      file: file,
    };
  }
}
