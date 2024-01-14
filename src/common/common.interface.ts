import { Type } from '@nestjs/common';

export interface SwaggerResponseProps {
  status: number;
  message: string;
  success: boolean;
  data?: Record<string, unknown>;
}

export interface SwaggerApiOptionsProps {
  name: string;
  success?: number;
  fail?: number;
  isPagination?: boolean;
  model?: Type<unknown>;
}

export interface PaginationProps {
  take: number;
  skip: number;
  pageNo: number;
  pageSize: number;
  page: number;
}

export interface PaginationOptions
  extends Omit<PaginationProps, 'pageNo' | 'pageSize'> {}
