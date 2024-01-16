import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { Customer } from '../customer/entity/customer.entity';
import { OrderStatus } from '../common/constant/entity.enum';
import { FindOrderPropsWhere } from './order.interface';
import { PaginationOptions } from '../common/common.interface';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepo: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepo = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('saveMany', () => {
    it('should save orders', async () => {
      const date = new Date('2024-01-01');
      const mockData = JSON.stringify({
        '주문고객 id': 1,
        주문일자: date,
        주문금액: 10000,
        주문타입: 'order',
      });

      const orders: Order[] = [Order.create(JSON.parse(mockData))];

      jest.spyOn(orderRepo, 'save').mockImplementation((order: Order) => {
        return Promise.resolve(order);
      });

      const result = await orderService.saveMany(orders);

      expect(result[0]).toBeInstanceOf(Order);
      expect(result[0].createdAt).toEqual(date);
      expect(result[0].amount).toEqual(10000);
      expect(result[0].status).toEqual(OrderStatus.ORDERED);
      expect(result[0].customerId).toEqual(Customer.byId(1));
      expect(orderRepo.save).toHaveBeenCalledWith(orders);
    });
  });

  describe('findOrderByOptionsAndCount', () => {
    it('should find orders by options and return count', async () => {
      const date = new Date('2024-01-01');
      const pageOptions: PaginationOptions = {
        skip: 0,
        take: 10,
        page: 1,
      };
      const param: FindOrderPropsWhere = {
        startDate: date,
        endDate: date,
        isDate: true,
        customerId: Customer.byId(1),
        status: OrderStatus.ORDERED,
      };
      const expectedOrders = [
        {
          id: 1,
          customerId: Customer.byId(1),
          createdAt: date,
          amount: 10000,
          status: OrderStatus.ORDERED,
        },
      ];
      const expectedCount: number = 10;

      jest
        .spyOn(orderRepo, 'findAndCount')
        .mockResolvedValue([expectedOrders, expectedCount]);

      const result = await orderService.findOrderByOptionsAndCount(
        pageOptions,
        param,
      );

      expect(result).toEqual([expectedOrders, expectedCount]);
    });
  });
});
