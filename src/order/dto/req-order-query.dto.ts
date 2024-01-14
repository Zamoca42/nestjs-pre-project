import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/get-pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FindOrderProps, FindOrderPropsWhere } from '../order.interface';
import { Customer } from '../../customer/entity/customer.entity';
import { OrderStatus } from '../../common/constant/entity.enum';

export class OrderQueryParam extends PaginationDto implements FindOrderProps {
  @ApiProperty({
    description: '기간 조회 시 시작일',
    required: false,
    example: '2024-01-01',
  })
  @IsString()
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @ApiProperty({
    description: '기간 조회 시 종료일',
    required: false,
    example: '2024-01-31',
  })
  @IsString()
  @IsDateString()
  @IsOptional()
  endDate: Date;

  @ApiProperty({
    description: '주문 또는 반품만을 조회, 0: 주문, 1: 반품',
    required: false,
    example: 1,
  })
  @IsInt()
  @Max(1)
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  orderType: number;

  @ApiProperty({
    description: '특정 고객의 주문만 조회 시, 고객 id',
    required: false,
    example: 11,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  customerId: number;

  getQueryProps(): FindOrderPropsWhere {
    const status =
      this.orderType === 0
        ? OrderStatus.ORDERED
        : this.orderType === 1
        ? OrderStatus.REFUNDED
        : undefined;
    const isDate: boolean = !!this.startDate && !!this.endDate;
    return {
      startDate: this.startDate,
      endDate: this.endDate,
      customerId: Customer.byId(this.customerId),
      isDate,
      status,
    };
  }
}
