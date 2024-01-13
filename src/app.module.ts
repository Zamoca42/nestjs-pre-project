import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { typeOrmConfig } from './common/config/typeorm.config';

@Module({
  imports: [CommonModule, TypeOrmModule.forRoot(typeOrmConfig)],
})
export class AppModule {}
