import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { typeOrmConfig } from './common/config/typeorm.config';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    CustomerModule,
    OrderModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
