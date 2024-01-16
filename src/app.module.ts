import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { typeOrmConfig } from './common/config/typeorm.config';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { UploadService } from './upload/upload.service';
import { AppController } from './app.controller';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    CustomerModule,
    OrderModule,
    UploadModule,
  ],
  providers: [UploadService],
  controllers: [AppController],
})
export class AppModule {}
