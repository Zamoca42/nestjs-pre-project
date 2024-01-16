import type { Order } from '../order/entity/order.entity';
import type { Customer } from '../customer/entity/customer.entity';
import { OrderStatus } from '../common/constant/entity.enum';

export interface OrderJson {
  '주문고객 id': Customer['id'];
  주문일자: Order['createdAt'];
  주문금액: Order['amount'];
  주문타입: OrderStatus;
}

export interface CustomerJson {
  '고객 id': Customer['id'];
  고객명: Customer['name'];
  고객등급: Customer['grade'];
}
