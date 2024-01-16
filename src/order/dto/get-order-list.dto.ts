import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../entity/order.entity';
import { Customer } from '../../customer/entity/customer.entity';
import { Money } from './get-money.dto';

export class GetOrderList {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _status: string;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _amount: number;
  @Exclude() private readonly _customerId: Customer;

  constructor(data: Order) {
    Object.keys(data).forEach((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '주문일자' })
  @Expose()
  get date(): string {
    return new Date(this._createdAt).toLocaleDateString('ko-KR');
  }

  @ApiProperty({ description: '주문고객명' })
  @Expose()
  get name(): string {
    return this._customerId.name;
  }

  @ApiProperty({ description: '주문고객 등급' })
  @Expose()
  get grade(): string {
    return this._customerId.grade;
  }

  @ApiProperty({ description: '주문 타입' })
  @Expose()
  get status(): string {
    return this._status;
  }

  @ApiProperty({ description: '주문 금액' })
  @Expose()
  get amount(): string {
    return Money.currencyFormat(this._amount);
  }
}
