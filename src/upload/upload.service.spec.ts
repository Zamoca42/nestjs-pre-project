import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { OrderService } from '../order/order.service';
import { CustomerService } from '../customer/customer.service';
import { Entity, OrderStatus } from '../common/constant/entity.enum';
import { Customer } from '../customer/entity/customer.entity';
import { Order } from '../order/entity/order.entity';
import { CustomerJson, OrderJson } from './upload.interface';

describe('UploadService', () => {
  let uploadService: UploadService;
  let orderService: OrderService;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: OrderService,
          useValue: {
            saveMany: jest.fn(),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            saveMany: jest.fn(),
          },
        },
      ],
    }).compile();

    uploadService = module.get<UploadService>(UploadService);
    orderService = module.get<OrderService>(OrderService);
    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(uploadService).toBeDefined();
  });

  describe('saveDataToEntity', () => {
    it('should save data to entity', async () => {
      const data: OrderJson[] = [
        {
          '주문고객 id': 1,
          주문일자: new Date('2024-01-01'),
          주문금액: 10000,
          주문타입: OrderStatus.ORDERED,
        },
      ];
      const filename = 'order';

      jest.spyOn(orderService, 'saveMany').mockResolvedValueOnce([]);

      const result = await uploadService.saveDataToEntity(data, filename);

      expect(result).toEqual(1);
      expect(orderService.saveMany).toHaveBeenCalledWith([
        Order.create(data[0]),
      ]);
    });

    it('should save data to entity', async () => {
      const data: CustomerJson[] = [
        {
          '고객 id': 1,
          고객명: 'John Doe',
          고객등급: 'A',
        },
      ];
      const filename = 'customer';

      jest.spyOn(customerService, 'saveMany').mockResolvedValueOnce([]);

      const result = await uploadService.saveDataToEntity(data, filename);

      expect(result).toEqual(1);
      expect(customerService.saveMany).toHaveBeenCalledWith([
        Customer.create(data[0]),
      ]);
    });
  });

  describe('parseFilename', () => {
    it('should return entity name for customer file', () => {
      const file = {
        originalname: 'customer.csv',
      };

      const result = uploadService.parseFilename(file.originalname);

      expect(result).toEqual(Entity.CUSTOMER);
    });

    it('should return entity name for order file', () => {
      const file = {
        originalname: 'order.csv',
      };

      const result = uploadService.parseFilename(file.originalname);

      expect(result).toEqual(Entity.ORDER);
    });
  });
});
