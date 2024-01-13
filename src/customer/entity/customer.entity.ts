import { Order } from '../../order/entity/order.entity';
import { PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 4 })
  grade: string;

  @OneToMany(() => Order, (order: Order) => order.customerId)
  orders: Order[];

  static byId(id: number): Customer {
    const customer = new Customer();
    customer.id = id;
    return customer;
  }
}
