import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseEntity<T> {
  @ApiProperty({
    description: '요청에 대한 응답 상태코드 필드입니다',
    enum: HttpStatus,
    example: HttpStatus.OK,
  })
  @Expose()
  readonly code: HttpStatus;

  @ApiProperty({
    description: '요청에 대한 응답 메시지 필드 입니다',
    type: String,
    example: '요청에 성공하였습니다',
  })
  @Expose()
  readonly message: string;

  @ApiProperty({
    description: '요청에 대한 성공 여부 필드 입니다',
    type: Boolean,
    example: true,
  })
  @Expose()
  readonly success: boolean;

  @ApiProperty({
    description: '요청에 대한 데이터 필드 입니다',
    type: Object,
    required: false,
  })
  @Expose()
  readonly data: T;

  constructor(code: HttpStatus, message: string, success: boolean, data: T) {
    this.code = code;
    this.message = message;
    this.success = success;
    this.data = data;
  }

  static OK_WITH<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity(HttpStatus.OK, message, true, data);
  }

  static CREATED(message: string): ResponseEntity<string> {
    return new ResponseEntity(HttpStatus.CREATED, message, true, '');
  }

  static EXCEPTION(message: string, code: HttpStatus): ResponseEntity<string> {
    return new ResponseEntity(code, message, false, '');
  }
}
