import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {
    this.logger = new Logger('HttpRequest');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url } = context.getArgByIndex(0);
    this.logger.debug(`Request to ${method} ${url}`);

    return next
      .handle()
      .pipe(
        tap((data) =>
          this.logger.debug(
            `Response from ${method} ${url} \n response: ${JSON.stringify(
              data,
              null,
              2,
            )}`,
          ),
        ),
      );
  }
}
