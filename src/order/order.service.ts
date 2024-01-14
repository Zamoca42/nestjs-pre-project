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
import { FindOrderPropsWhere } from './order.interface';

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
