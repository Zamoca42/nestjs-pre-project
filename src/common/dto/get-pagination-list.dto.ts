import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PaginationOptions } from '../common.interface';

export class PageEntity<T> {
  @Exclude() private readonly _take: number;
  @Exclude() private readonly _count: number;
  @Exclude() private readonly _results: T[];
  @Exclude() private readonly _page: number;

  constructor(options: PaginationOptions, results: T[], count: number) {
    this._page = options.page;
    this._take = options.take;
    this._count = count;
    this._results = results;
  }

  @ApiProperty({
    description: '페이지당 항목 수가 적용된 결과 데이터',
  })
  @Expose()
  get items(): T[] {
    return this._results;
  }

  @ApiProperty({
    description: '페이지네이션: 조회할 페이지 번호',
  })
  @Expose()
  get pageNo(): number {
    return this._page;
  }

  @ApiProperty({
    description: '페이지네이션: 한 페이지 조회 건 수',
  })
  @Expose()
  get pageSize(): number {
    return this._take;
  }

  @ApiProperty({
    description: '총 페이지 수',
  })
  @Expose()
  get totalPage(): number {
    return Math.ceil(this._count / this._take);
  }

  @ApiProperty({
    description: '항목 수 (현재 페이지 기준)',
  })
  @Expose()
  get itemCount(): number {
    return this.items.length;
  }

  static create<T>(
    options: PaginationOptions,
    response: T[],
    count: number,
  ): PageEntity<T> {
    return new PageEntity<T>(options, response, count);
  }
}
