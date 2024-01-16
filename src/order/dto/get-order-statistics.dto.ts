import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { RawMonthlyOrder } from '../order.interface';
import { Money } from './get-money.dto';

export class GetOrderStatistics {
  @Exclude() private readonly _date: Date;
  @Exclude() private readonly _order: number;
  @Exclude() private readonly _refund: number;
  @Exclude() private readonly _amount: number;

  constructor(data: RawMonthlyOrder) {
    Object.keys(data).forEach((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '통계 기준 날짜(월) 단위' })
  @Expose()
  get date(): string {
    const date = new Date(this._date);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  }

  @ApiProperty({ description: '주문 합계 금액' })
  @Expose()
  get order(): string {
    return Money.currencyFormat(this._order);
  }

  @ApiProperty({ description: '환불 합계 금액' })
  @Expose()
  get refund(): string {
    return Money.currencyFormat(this._refund);
  }

  @ApiProperty({ description: '순수 주문 금액' })
  @Expose()
  get amount(): string {
    return Money.currencyFormat(this._amount);
  }
}
