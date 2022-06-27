import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from 'libs/entity/config/configService';
import {
  CurrentWeatherApiResponse,
  ForecastWeatherApiResponse,
  HistoricalWeatherApiResponse,
} from 'libs/entity/domain/weather/ExternalWeatherApiResponse';
import { Weather } from 'libs/entity/domain/weather/weather.entity';
import {
  GreetingType,
  HeadsUpType,
  TemperatureType,
} from 'libs/entity/domain/weather/WeatherMessageType';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { ResponseEntity } from '@app/common/response/ResponseEntity';

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  private async getCurrentWeather(
    weather: Weather,
  ): Promise<CurrentWeatherApiResponse> {
    const currentWeatherUrl =
      ConfigService.weatherAPI().CURRENT_URL +
      `&lat=${weather.lat}&lon=${weather.lon}`;

    try {
      return (await lastValueFrom(
        this.httpService
          .get(currentWeatherUrl)
          .pipe(map((response) => response.data)),
      )) as CurrentWeatherApiResponse;
    } catch (e) {
      throw ResponseEntity.ERROR_WITH(e.message, e.response.status);
    }
  }

  private async getHistoricalWeather(
    weather: Weather,
    hourOffset: number,
  ): Promise<HistoricalWeatherApiResponse> {
    const historicalWeatherUrl =
      ConfigService.weatherAPI().HISTORICAL_URL +
      `&lat=${weather.lat}&lon=${weather.lon}&hour_offset=${hourOffset}`;

    try {
      return (await lastValueFrom(
        this.httpService
          .get(historicalWeatherUrl)
          .pipe(map((response) => response.data)),
      )) as HistoricalWeatherApiResponse;
    } catch (e) {
      throw ResponseEntity.ERROR_WITH(e.message, e.response.status);
    }
  }

  private async getForecastWeather(
    weather: Weather,
    hourOffset: number,
  ): Promise<ForecastWeatherApiResponse> {
    const forecastWeatherUrl =
      ConfigService.weatherAPI().FORECAST_URL +
      `&lat=${weather.lat}&lon=${weather.lon}&hour_offset=${hourOffset}`;

    try {
      return (await lastValueFrom(
        this.httpService
          .get(forecastWeatherUrl)
          .pipe(map((response) => response.data)),
      )) as ForecastWeatherApiResponse;
    } catch (e) {
      throw ResponseEntity.ERROR_WITH(e.message, e.response.status);
    }
  }

  async setGreetingMessage(weather: Weather): Promise<void> {
    weather.setGreetingMessage(GreetingType['0']);
  }

  async setTemperatureMessage(weather: Weather): Promise<void> {
    weather.setTemperatureMessage(TemperatureType['0']);
  }

  async setHeadsUpMessage(weather: Weather): Promise<void> {
    weather.setHeadsUpMessage(HeadsUpType['0']);
  }
}
