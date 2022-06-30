import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WeatherInfoService } from './weatherInfo.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 1000,
        maxRedirects: 1,
      }),
    }),
  ],
  providers: [WeatherInfoService],
  exports: [WeatherInfoService],
})
export class WeatherInfoModule {}
