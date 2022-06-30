import { Weather } from '@app/entity/domain/weather/weather.entity';
import {
  ForecastApiResponse,
  WeatherApiResponse,
  WeatherCode,
} from '@app/entity/domain/weather/WeatherInfoApiResponse';
import { HttpService } from '@nestjs/axios';
import { WeatherInfoService } from '../../src/Weather/adapter/weatherInfo.service';

export class WeatherInfoServiceStub extends WeatherInfoService {
  private code: WeatherCode;
  private temp: number;
  private rain1h: number;
  private minTemp: number;
  private maxTemp: number;
  private rainPercentage: number;

  constructor(httpService: HttpService) {
    super(httpService);
  }

  setTestWeatherInfo(code: WeatherCode, temp: number, rain1h: number): void {
    this.code = code;
    this.temp = temp;
    this.rain1h = rain1h;
  }

  setTestForecastInfo(
    code: WeatherCode,
    minTemp: number,
    maxTemp: number,
    rainPercentage: number,
  ): void {
    this.code = code;
    this.minTemp = minTemp;
    this.maxTemp = maxTemp;
    this.rainPercentage = rainPercentage;
  }

  async getCurrentWeather(_weather: Weather): Promise<WeatherApiResponse> {
    return {
      timestamp: new Date().getTime(),
      code: this.code,
      temp: this.temp,
      rain1h: this.rain1h,
    };
  }

  async getHistoricalWeather(
    _weather: Weather,
    _hourOffset: number,
  ): Promise<WeatherApiResponse> {
    return {
      timestamp: new Date().getTime(),
      code: this.code,
      temp: this.temp,
      rain1h: this.rain1h,
    };
  }

  async getForecastWeather(
    _weather: Weather,
    _hourOffset: number,
  ): Promise<ForecastApiResponse> {
    return {
      timestamp: new Date().getTime(),
      code: this.code,
      min_temp: this.minTemp,
      max_temp: this.maxTemp,
      rain: this.rainPercentage,
    };
  }
}
