import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { CustomValidationError } from './CustomValidationError';
import { ResponseEntity } from '../response/ResponseEntity';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = (exception as HttpException).getStatus();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const responseBody = (exception as HttpException).getResponse();
    const isValidationError = responseBody instanceof ValidationError;

    return response
      .status(status)
      .json(
        instanceToPlain(
          ResponseEntity.ERROR_WITH_DATA<CustomValidationError[]>(
            responseBody['error'] === undefined
              ? responseBody['message']
              : responseBody['error'],
            status,
            isValidationError
              ? [this.toCustomValidationErrorByNest(responseBody)]
              : (responseBody['message'] as CustomValidationError[]),
          ),
        ),
      );
  }

  toCustomValidationErrorByNest(
    responseBody: ValidationError,
  ): CustomValidationError {
    return new CustomValidationError(responseBody);
  }
}
