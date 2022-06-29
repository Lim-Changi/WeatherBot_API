import { Module } from '@nestjs/common';
import { WeatherInfoModule } from './adapter/weatherInfo.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [WeatherInfoModule],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
