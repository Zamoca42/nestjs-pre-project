import { Injectable } from '@nestjs/common';
import { utils, read } from 'xlsx';
import { Customer } from '../customer/entity/customer.entity';
import { Order } from '../order/entity/order.entity';
import { CustomerService } from '../customer/customer.service';
import { OrderService } from '../order/order.service';
import { Entity } from '../common/constant/entity.enum';

@Injectable()
export class UploadService {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
  ) {}

  saveDataToEntity(data: unknown[], filename: string): number {
    filename === Entity.CUSTOMER
      ? this.customerService.saveMany(data.map((data) => Customer.create(data)))
      : this.orderService.saveMany(data.map((data) => Order.create(data)));

    return data.length;
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

  csvToJson(file: Express.Multer.File): unknown[] {
    const workbook = read(file.buffer.toString('utf-8'), {
      type: 'string',
      cellNF: true,
    });

    return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  }
}
