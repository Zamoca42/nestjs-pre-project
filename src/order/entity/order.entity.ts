import { Customer } from '../../customer/entity/customer.entity';
import { OrderStatus } from '../../common/constant/entity.enum';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  JoinColumn,
} from 'typeorm';
import { OrderJson } from '../../upload/upload.interface';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer: Customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customerId: Customer;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ name: 'created_at', type: 'date' })
  createdAt: Date;

  @Column({ type: 'integer' })
  amount: number;

  static create(data: OrderJson) {
    const order = new Order();
    order.customerId = Customer.byId(data['주문고객 id']);
    order.createdAt = new Date(data['주문일자']);
    order.amount = data['주문금액'];
    order.status = data['주문타입'];
    return order;
  }
}
