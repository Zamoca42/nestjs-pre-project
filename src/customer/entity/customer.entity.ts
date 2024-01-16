import { CustomerJson } from '../../upload/upload.interface';
import { Order } from '../../order/entity/order.entity';
import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm';

@Entity()
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

  static create(data: CustomerJson) {
    const customer = new Customer();
    customer.id = data['고객 id'];
    customer.name = data['고객명'];
    customer.grade = data['고객등급'];
    return customer;
  }
}
