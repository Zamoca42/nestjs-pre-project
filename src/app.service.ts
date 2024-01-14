import { Injectable } from '@nestjs/common';
import { utils, read } from 'xlsx';
import { Customer } from './customer/entity/customer.entity';
import { Order } from './order/entity/order.entity';
import { CustomerService } from './customer/customer.service';
import { OrderService } from './order/order.service';
import { Entity } from './common/constant/entity.enum';

@Injectable()
export class AppService {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
  ) {}

  saveCsvData(file: Express.Multer.File): number {
    const workbook = read(file.buffer.toString('utf-8'), {
      type: 'string',
      cellNF: true,
    });
    const jsonData = utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
    );

    this.parseFilename(file) === Entity.CUSTOMER
      ? this.customerService.saveMany(
          jsonData.map((data) => Customer.create(data)),
        )
      : this.orderService.saveMany(jsonData.map((data) => Order.create(data)));

    return jsonData.length;
  }

  parseFilename(file: Express.Multer.File): string {
    const filename = file.originalname;

    if (filename.includes('customer')) {
      return Entity.CUSTOMER;
    }

    if (filename.includes('order')) {
      return Entity.ORDER;
    }
  }
}
