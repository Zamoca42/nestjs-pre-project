import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { OrderModule } from '../order/order.module';
import { UploadService } from './upload.service';

@Module({
  imports: [CustomerModule, OrderModule],
  providers: [UploadService],
})
export class UploadModule {}
