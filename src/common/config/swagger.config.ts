import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

export const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
  .setTitle('API Document')
  .addServer('/api')
  .build();
