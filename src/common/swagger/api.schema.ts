import { SwaggerResponseProps } from '../common.interface';

export const createSchema = ({
  status,
  message,
  success,
  data,
}: SwaggerResponseProps) => ({
  properties: {
    code: { enum: [status] },
    message: {
      type: 'string',
      example: message,
    },
    success: { type: 'boolean', example: success },
    data: data ?? { type: 'object' },
  },
});
