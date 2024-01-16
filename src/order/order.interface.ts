import { OrderStatus } from '../common/constant/entity.enum';
import { Customer } from '../customer/entity/customer.entity';
import { Order } from './entity/order.entity';

export interface FindOrderProps {
  startDate: Order['createdAt'];
  endDate: Order['createdAt'];
  orderType: number;
  customerId: Customer['id'];
}

export interface FindOrderPropsWhere
  extends Omit<FindOrderProps, 'customerId' | 'orderType'> {
  customerId: Customer;
  status: OrderStatus;
  isDate: boolean;
}

export interface RawMonthlyOrder {
  date: Order['createdAt'];
  order: Order['amount'];
  refund: Order['amount'];
  amount: Order['amount'];
}
