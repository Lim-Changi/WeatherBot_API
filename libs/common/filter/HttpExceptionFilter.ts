import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { CustomValidationError } from './CustomValidationError';
import { ResponseEntity } from '../response/ResponseEntity';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('HttpExceptionFilter');
  }

  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = (exception as HttpException).getStatus();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const responseBody = (exception as HttpException).getResponse();
    const isValidationError = responseBody instanceof ValidationError;

    const errorData = instanceToPlain(
      ResponseEntity.ERROR_WITH_DATA<CustomValidationError[]>(
        responseBody['error'] === undefined
          ? responseBody['message']
          : responseBody['error'],
        status,
        isValidationError
          ? [this.toCustomValidationErrorByNest(responseBody)]
          : (responseBody['message'] as CustomValidationError[]),
      ),
    );

    this.logger.error(errorData);

    return response.status(status).json(errorData);
  }

  toCustomValidationErrorByNest(
    responseBody: ValidationError,
  ): CustomValidationError {
    return new CustomValidationError(responseBody);
  }
}
