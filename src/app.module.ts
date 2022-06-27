import { ValidationSchema } from '@app/common/config/validationSchema';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './HealthCheck/HealthCheckController';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ValidationSchema,
    }),
    HttpModule,
    TerminusModule,
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
