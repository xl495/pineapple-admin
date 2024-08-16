import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class PaginationService {
  getPaginationOptions(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (Number(page) - 1) * Number(limit);

    return {
      skip,
      take: Number(limit),
    };
  }

  createPaginationMeta(totalCount: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = Math.ceil(totalCount / Number(limit));

    return {
      count: totalCount,
      totalPages,
      currentPage: page,
      perPage: limit,
    };
  }
}
