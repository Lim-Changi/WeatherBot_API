import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';

export class ResponseEntity<T> {
  @Exclude() private readonly _statusCode: HttpStatus;
  @Exclude() private readonly _message: string;
  @Exclude() private readonly _data: T;

  private constructor(status: HttpStatus, message: string, data: T) {
    this._statusCode = status;
    this._message = message;
    this._data = data;
  }

  static ONLY_DATA<T>(data: T): T {
    return data;
  }

  static OK(): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.OK, '', '');
  }

  static OK_WITH(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.OK, message, '');
  }

  static OK_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.OK, message, data);
  }

  static CREATED(): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.CREATED, '', '');
  }

  static CREATED_WITH(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.CREATED, message, '');
  }

  static CREATED_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.CREATED, message, data);
  }

  static NOT_FOUND(): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.NOT_FOUND, '', '');
  }

  static NOT_FOUND_WITH(message: string): ResponseEntity<string> {
    return new ResponseEntity(HttpStatus.NOT_FOUND, message, '');
  }

  static UNAUTHORIZED(): ResponseEntity<string> {
    return new ResponseEntity<string>(
      HttpStatus.UNAUTHORIZED,
      'Unauthorized',
      'Unauthorized',
    );
  }

  static REQUEST_TIMEOUT(): ResponseEntity<string> {
    return new ResponseEntity<string>(
      HttpStatus.REQUEST_TIMEOUT,
      'Request Timeout',
      'Request Timeout',
    );
  }

  static BAD_REQUEST(): ResponseEntity<string> {
    return new ResponseEntity<string>(HttpStatus.BAD_REQUEST, '', '');
  }

  static BAD_REQUEST_WITH(message: string): ResponseEntity<string> {
    return new ResponseEntity(HttpStatus.BAD_REQUEST, message, '');
  }

  static ERROR(): ResponseEntity<string> {
    return new ResponseEntity<string>(
      HttpStatus.INTERNAL_SERVER_ERROR,
      '?????? ????????? ??????????????????.',
      '',
    );
  }

  static ERROR_WITH(
    message: string,
    code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): ResponseEntity<string> {
    return new ResponseEntity<string>(code, message, '');
  }

  static ERROR_WITH_DATA<T>(
    message: string,
    code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    data: T,
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(code, message, data);
  }

  @ApiProperty({
    title: '?????? ??????',
    example: '200 | 201 | 500',
  })
  @Expose()
  get statusCode(): HttpStatus {
    return this._statusCode;
  }

  @ApiProperty({
    title: '?????? ?????????',
    example: `'' | ?????? ????????? ??????????????????. | ?????? ???`,
  })
  @Expose()
  get message(): string {
    return this._message;
  }

  @ApiProperty({
    title: '?????? ?????????',
    example: `'' | {}`,
  })
  @Expose()
  get data(): T {
    return this._data;
  }
}
