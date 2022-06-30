import { Injectable } from '@nestjs/common';
import { ConfigService } from '@app/entity/config/configService';
import {
  ForecastApiResponse,
  WeatherApiResponse,
} from '@app/entity/domain/weather/WeatherInfoApiResponse';
import { Weather } from '@app/entity/domain/weather/Weather.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { ResponseEntity } from '@app/common/response/ResponseEntity';

@Injectable()
export class WeatherInfoService {
  constructor(private readonly httpService: HttpService) {}

  async getCurrentWeather(weather: Weather): Promise<WeatherApiResponse> {
    const currentWeatherUrl =
      ConfigService.weatherAPI().CURRENT_URL +
      `&lat=${weather.lat}&lon=${weather.lon}`;

    try {
      return (await lastValueFrom(
        this.httpService
          .get(currentWeatherUrl)
          .pipe(map((response) => response.data)),
      )) as WeatherApiResponse;
    } catch (e) {
      throw ResponseEntity.ERROR_WITH(
        'Current Error >> ' + e.message,
        e.response.status,
      );
    }
  }

  async getHistoricalWeather(
    weather: Weather,
    hourOffset: number,
  ): Promise<WeatherApiResponse> {
    const historicalWeatherUrl =
      ConfigService.weatherAPI().HISTORICAL_URL +
      `&lat=${weather.lat}&lon=${weather.lon}&hour_offset=${hourOffset}`;

    try {
      return (await lastValueFrom(
        this.httpService
          .get(historicalWeatherUrl)
          .pipe(map((response) => response.data)),
      )) as WeatherApiResponse;
    } catch (e) {
      throw ResponseEntity.ERROR_WITH(
        'Historical Error >> ' + e.message,
        e.response.status,
      );
    }
  }

  async getForecastWeather(
    weather: Weather,
    hourOffset: number,
  ): Promise<ForecastApiResponse> {
    const forecastWeatherUrl =
      ConfigService.weatherAPI().FORECAST_URL +
      `&lat=${weather.lat}&lon=${weather.lon}&hour_offset=${hourOffset}`;

    try {
      return (await lastValueFrom(
        this.httpService
          .get(forecastWeatherUrl)
          .pipe(map((response) => response.data)),
      )) as ForecastApiResponse;
    } catch (e) {
      throw ResponseEntity.ERROR_WITH(
        'Forecast Error >> ' + e.message,
        e.response.status,
      );
    }
  }
}
