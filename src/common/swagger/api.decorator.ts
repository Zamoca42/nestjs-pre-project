import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PageEntity } from '../dto/get-pagination-list.dto';
import { ResponseEntity } from '../entity/response.entity';
import { createSchema } from './api.schema';
import { SwaggerApiOptionsProps } from '../common.interface';

export const SwaggerAPI = ({
  name,
  success = HttpStatus.OK,
  model = Object,
  isPagination = false,
}: SwaggerApiOptionsProps): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: `${name} API`,
    }),

    ApiExtraModels(PageEntity, ResponseEntity, model),

    ApiBadRequestResponse({
      description:
        '잘못된 요청일 때 응답입니다. 400 상태코드와 함께 메시지가 반환됩니다',
      schema: {
        allOf: [
          createSchema({
            status: HttpStatus.BAD_REQUEST,
            message: '[ 잘못된 요청에 대한 메세지들 ]',
            success: false,
          }),
        ],
      },
    }),

    ApiResponse({
      status: success,
      description: '성공 시 OK 응답을 반환합니다.',
      schema: {
        allOf: [
          createSchema({
            status: success,
            message: `${name} 했습니다.`,
            success: true,
            data: isPagination
              ? {
                  $ref: getSchemaPath(PageEntity),
                  properties: {
                    results: {
                      type: 'array',
                      items: { $ref: getSchemaPath(model) },
                    },
                  },
                }
              : {
                  $ref: getSchemaPath(model),
                },
          }),
        ],
      },
    }),
  );
};
