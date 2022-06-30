import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@app/entity/config/configService';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ResponseEntity } from '../response/ResponseEntity';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly timeoutLimit = ConfigService.timeout();
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutLimit),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => ResponseEntity.REQUEST_TIMEOUT());
        }
        return throwError(() => err);
      }),
    );
  }
}
