import { Customer } from '../../customer/entity/customer.entity';
import { PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer: Customer) => customer.orders)
  customerId: Customer;

  @Column({ type: 'varchar', length: 8 })
  status: string;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'integer' })
  amount: number;
}
