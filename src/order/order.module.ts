import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { CustomerModule } from '../customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';

@Module({
  imports: [CustomerModule, TypeOrmModule.forFeature([Order])],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
