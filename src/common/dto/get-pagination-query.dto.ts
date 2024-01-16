import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationOptions, PaginationProps } from '../common.interface';

export class PaginationDto implements PaginationProps {
  @ApiProperty({
    description: '페이지네이션: 조회할 페이지 번호',
    required: false,
    example: 2,
    default: 1,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  pageNo: number;

  @ApiProperty({
    description: '페이지네이션: 한 페이지 조회 건 수',
    required: false,
    example: 10,
    default: 10,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  pageSize: number;

  get skip(): number {
    return this.page < 0 ? 0 : (this.page - 1) * this.take;
  }

  get take(): number {
    return this.pageSize || 50;
  }

  get page(): number {
    return this.pageNo || 1;
  }

  getPageProps(): PaginationOptions {
    return {
      take: this.take,
      skip: this.skip,
      page: this.page,
    };
  }
}
