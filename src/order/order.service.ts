import { Injectable } from '@nestjs/common';
import { Order } from './entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { PaginationOptions } from 'src/common/common.interface';
import { FindOrderPropsWhere, RawMonthlyOrder } from './order.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  saveMany(orders: Order[]): Promise<Order[]> {
    return this.orderRepo.save(orders);
  }

  findOrderByOptionsAndCount(
    pageOptions: PaginationOptions,
    param: FindOrderPropsWhere,
  ): Promise<[Order[], number]> {
    const { skip, take } = pageOptions;
    const options = this.findOrderManyOptions(param);

    return this.orderRepo.findAndCount({
      skip,
      take,
      ...options,
    });
  }

  findMonthlySales(): Promise<RawMonthlyOrder[]> {
    return this.orderRepo
      .createQueryBuilder('o')
      .select(
        `date_trunc('month', o.createdAt)::date as date,
      sum(CASE WHEN o.status = 'order' THEN o.amount ELSE 0 END) as order,
      sum(CASE WHEN o.status = 'refund' THEN o.amount ELSE 0 END) as refund,
      sum(CASE WHEN o.status = 'order' THEN o.amount ELSE -o.amount END) as amount`,
      )
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  private findOrderManyOptions(
    param: FindOrderPropsWhere,
  ): FindManyOptions<Order> {
    const date = param.isDate
      ? Between(param.startDate, param.endDate)
      : undefined;

    const where: FindOptionsWhere<Order> = {
      customerId: param.customerId,
      createdAt: date,
      status: param.status,
    };
    const relations: FindOptionsRelations<Order> = { customerId: true };
    const select: FindOptionsSelect<Order> = {
      id: true,
      customerId: { name: true, grade: true },
      createdAt: true,
      amount: true,
      status: true,
    };
    const order: FindOptionsOrder<Order> = { createdAt: 'DESC' };
    return { where, relations, select, order };
  }
}
