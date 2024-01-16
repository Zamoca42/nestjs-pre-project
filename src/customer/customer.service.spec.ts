import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entity/customer.entity';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let customerRepo: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    customerRepo = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
  });

  it('should be defined', () => {
    expect(customerService).toBeDefined();
  });

  describe('saveMany', () => {
    it('should save customers', async () => {
      const mockData = JSON.stringify({
        '고객 id': 1,
        고객명: 'John Doe',
        고객등급: 'A',
      });

      const customers: Customer[] = [Customer.create(JSON.parse(mockData))];

      jest
        .spyOn(customerRepo, 'save')
        .mockImplementation((customer: Customer) => {
          return Promise.resolve(customer);
        });

      const result = await customerService.saveMany(customers);

      expect(result).toEqual(customers);
      expect(result[0].id).toEqual(1);
      expect(result[0].name).toEqual('John Doe');
      expect(result[0].grade).toEqual('A');
      expect(customerRepo.save).toHaveBeenCalledWith(customers);
    });
  });
});
