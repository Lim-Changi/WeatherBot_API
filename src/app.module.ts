import { ValidationSchema } from '@app/common/config/validationSchema';
import { LoggingModule } from '@app/common/logging/logging.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './HealthCheck/HealthCheckController';
import { WeatherModule } from './Weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ValidationSchema,
    }),
    TerminusModule,
    LoggingModule,
    WeatherModule,
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
