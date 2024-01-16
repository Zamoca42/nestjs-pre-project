import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

export const FileAPI = (): MethodDecorator => {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file')),

    ApiConsumes('multipart/form-data'),

    ApiBody({
      description: 'CSV file',
      required: true,
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
};
