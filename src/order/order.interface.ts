import { OrderStatus } from '../common/constant/entity.enum';
import { Customer } from '../customer/entity/customer.entity';

export interface FindOrderProps {
  startDate: Date;
  endDate: Date;
  orderType: number;
  customerId: number;
}

export interface FindOrderPropsWhere
  extends Omit<FindOrderProps, 'customerId' | 'orderType'> {
  customerId?: Customer;
  status: OrderStatus;
  isDate: boolean;
}

export interface RawMonthlyOrder {
  date: Date;
  order: number;
  refund: number;
  amount: number;
}
