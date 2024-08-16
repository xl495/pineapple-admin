import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export const Pagination = createParamDecorator(
  (dtoClass: Type<PaginationDto>, ctx: ExecutionContext): PaginationDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    // 将请求的查询参数转换为 DTO
    const dtoObject = plainToClass(dtoClass, query);

    // 如果查询参数中没有 page 或 limit，则使用默认值
    if (isNaN(query.page)) {
      dtoObject.page = 1;
    }

    // 如果查询参数中没有 page 或 limit，则使用默认值
    if (isNaN(query.limit)) {
      dtoObject.limit = 10;
    }

    // 同步验证 DTO 并抛出错误（如果有的话）
    const errors = validateSync(dtoObject);
    if (errors.length > 0) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          message: '分页参数验证失败',
          data: null,
        },
        HttpStatus.OK,
      );
    }

    return dtoObject;
  },
);
