import { Injectable } from '@nestjs/common';
import { utils, read } from 'xlsx';
import { Customer } from '../customer/entity/customer.entity';
import { Order } from '../order/entity/order.entity';
import { CustomerService } from '../customer/customer.service';
import { OrderService } from '../order/order.service';
import { Entity } from '../common/constant/entity.enum';
import { CustomerJson, OrderJson } from './upload.interface';

@Injectable()
export class UploadService {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
  ) {}

  saveDataToEntity(
    data: (OrderJson | CustomerJson)[],
    filename: string,
  ): number {
    filename === Entity.CUSTOMER
      ? this.customerService.saveMany(
          data.map((data: CustomerJson) => Customer.create(data)),
        )
      : this.orderService.saveMany(
          data.map((data: OrderJson) => Order.create(data)),
        );

    return data.length;
  }

  parseFilename(fileOriginalname: string): string {
    if (fileOriginalname.includes('customer')) {
      return Entity.CUSTOMER;
    }

    if (fileOriginalname.includes('order')) {
      return Entity.ORDER;
    }
  }

  csvToJson(file: Express.Multer.File): (OrderJson | CustomerJson)[] {
    const workbook = read(file.buffer.toString('utf-8'), {
      type: 'string',
      cellNF: true,
    });

    return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  }
}
