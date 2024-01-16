import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';
import { createLog } from '../config/log-helper.config';
import { ResponseEntity } from '../entity/response.entity';

/**
 * Custom exception filter to convert EntityNotFoundError from TypeOrm to NestJs responses
 * @see also @https://gist.github.com/gsusmonzon/ecd7842495f07594761e40c2758617d0
 * @see also @https://docs.nestjs.com/exception-filters
 */
@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  /**
   * @param message - exception.message
   * @desc - 정규 표현식을 사용하여 개행 문자 및 빈 공간 제거
   *       - 개행 문자를 공백으로 대체
   *       - 여러 개의 공백을 하나로 축소
   *       - 쌍따옴표를 홑따옴표로 대체
   *       - 문자열 앞뒤의 공백 제거
   */
  private cleanUpMessage(message: string): string {
    return message
      .replace(/(\r\n|\r|\n)/gm, ' ')
      .replace(/\s+/g, ' ')
      .replace(/"/g, "'")
      .trim();
  }

  public catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const stack = exception.stack;
    const statusCode = HttpStatus.BAD_REQUEST;
    const cleanedUpMessage = this.cleanUpMessage(exception.message);
    const response = ResponseEntity.EXCEPTION(cleanedUpMessage, statusCode);
    const log = createLog({ req, stack, response });
    this.logger.log(log);

    return res.status(statusCode).json(response);
  }
}
