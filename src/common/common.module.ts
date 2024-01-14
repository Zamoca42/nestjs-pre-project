import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import {
  consoleTransport,
  errorLogFileTransport,
  infoLogFileTransport,
} from './config/winston.config';
import { envConfigOptions } from './config/env.config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot(envConfigOptions),
    WinstonModule.forRoot({
      transports: [
        consoleTransport,
        infoLogFileTransport,
        errorLogFileTransport,
      ],
    }),
  ],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [ConfigModule, WinstonModule],
})
export class CommonModule {}
