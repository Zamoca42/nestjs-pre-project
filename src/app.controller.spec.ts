import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { UploadService } from './upload/upload.service';
import { OrderService } from './order/order.service';
import { GetOrderList } from './order/dto/get-order-list.dto';
import { GetOrderStatistics } from './order/dto/get-order-statistics.dto';
import { PageEntity } from './common/dto/get-pagination-list.dto';
import { Order } from './order/entity/order.entity';
import { OrderStatus } from './common/constant/entity.enum';
import { OrderQueryParam } from './order/dto/req-order-query.dto';
import { plainToInstance } from 'class-transformer';
import { RawMonthlyOrder } from './order/order.interface';

describe('AppController', () => {
  let appController: AppController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: UploadService,
          useValue: {
            csvToJson: jest.fn(),
            parseFilename: jest.fn(),
            saveDataToEntity: jest.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: {
            findOrderByOptionsAndCount: jest.fn(),
            findMonthlySales: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    orderService = module.get<OrderService>(OrderService);
  });

  describe('findManyOrderByQueryParam', () => {
    it('should find many orders by query parameters', async () => {
      const params = plainToInstance(OrderQueryParam, {
        startDate: new Date('2024-01-01'),
        endDate: new Date(),
        orderType: 0,
        customerId: 1,
        pageNo: 1,
        pageSize: 10,
      });

      const response = [
        Order.create({
          '주문고객 id': 1,
          주문일자: new Date('2024-01-02'),
          주문금액: 10000,
          주문타입: OrderStatus.ORDERED,
        }),
      ];
      const count = 1;

      jest
        .spyOn(orderService, 'findOrderByOptionsAndCount')
        .mockResolvedValueOnce([response, count]);

      const result = await appController.findManyOrderByQueryParam(params);

      expect(orderService.findOrderByOptionsAndCount).toHaveBeenCalledWith(
        params.getPageProps(),
        params.getQueryProps(),
      );
      expect(result.message).toEqual(`Successfully find ${count} orders`);
      expect(result.code).toEqual(200);
      expect(result.data).toEqual(
        PageEntity.create(
          params.getPageProps(),
          response.map((data: Order) => new GetOrderList(data)),
          count,
        ),
      );
    });
  });

  describe('findMonthlySales', () => {
    it('should find monthly sales', async () => {
      const response: RawMonthlyOrder[] = [
        { date: new Date(), order: 100, refund: 100, amount: 0 },
      ];

      jest
        .spyOn(orderService, 'findMonthlySales')
        .mockResolvedValueOnce(response);

      const result = await appController.findMonthlySales();

      expect(orderService.findMonthlySales).toHaveBeenCalled();
      expect(result.message).toEqual(`Successfully find 1 monthly sales`);
      expect(result.code).toEqual(200);
      expect(result.data).toEqual(
        response.map((data: RawMonthlyOrder) => new GetOrderStatistics(data)),
      );
    });
  });
});
