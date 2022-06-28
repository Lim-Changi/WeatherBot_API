import { Injectable } from '@nestjs/common';
import { ConfigService } from 'libs/entity/config/configService';
import {
  ForecastApiResponse,
  WeatherApiResponse,
  WeatherCode,
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
  ): Promise<WeatherApiResponse> {
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

  private async getHistoricalWeather(
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

  private async getForecastWeather(
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

  private setGreetingMessage(
    currentWeather: WeatherApiResponse,
    weather: Weather,
  ): void {
    // 기획
    let currentWeatherMessage: GreetingType = null;
    if (currentWeather.code === WeatherCode.snow) {
      if (currentWeather.rain1h >= 100) {
        currentWeatherMessage = GreetingType[0];
      } else {
        currentWeatherMessage = GreetingType[1];
      }
    } else if (currentWeather.code === WeatherCode.rain) {
      if (currentWeather.rain1h >= 100) {
        currentWeatherMessage = GreetingType[2];
      } else {
        currentWeatherMessage = GreetingType[3];
      }
    } else if (currentWeather.code === WeatherCode.cloudy) {
      currentWeatherMessage = GreetingType[4];
    } else if (
      currentWeather.code === WeatherCode.sunny &&
      currentWeather.temp >= 30
    ) {
      currentWeatherMessage = GreetingType[5];
    } else if (currentWeather.temp <= 0) {
      currentWeatherMessage = GreetingType[6];
    } else {
      currentWeatherMessage = GreetingType[7];
    }
    weather.setGreetingMessage(currentWeatherMessage);
  }

  async setWeatherMessage(weather: Weather, days = 1): Promise<void> {
    const historicalWeather = [this.getCurrentWeather(weather)]; // 현재 날씨

    for (let i = 0; i < days; i++) {
      for (let j = 1; j <= 4; j++) {
        historicalWeather.push(
          this.getHistoricalWeather(weather, -(4 * i + j) * 6), // 과거 날씨
        );
      }
    }
    const historicalWeatherInfo: WeatherApiResponse[] = await Promise.all(
      historicalWeather,
    );

    // 기획
    let temperatureCompareMessage: string = null;
    const currentWeather = historicalWeatherInfo[0];
    const lastDayTemperatureInfo = historicalWeatherInfo[4 * days];
    const temperatureDifference =
      currentWeather.temp - lastDayTemperatureInfo.temp;

    // Greeting Message
    this.setGreetingMessage(currentWeather, weather);

    // Temperature Message
    if (temperatureDifference < 0) {
      // 현재 온도가 낮아짐
      if (currentWeather.temp >= 15) {
        temperatureCompareMessage = this.parseTemperatureMessage(
          TemperatureType[0],
          temperatureDifference,
        );
      } else {
        temperatureCompareMessage = this.parseTemperatureMessage(
          TemperatureType[3],
          temperatureDifference,
        );
      }
    } else if (temperatureDifference > 0) {
      // 현재 온도가 높아짐
      if (currentWeather.temp >= 15) {
        temperatureCompareMessage = this.parseTemperatureMessage(
          TemperatureType[1],
          temperatureDifference,
        );
      } else {
        temperatureCompareMessage = this.parseTemperatureMessage(
          TemperatureType[2],
          temperatureDifference,
        );
      }
    } else {
      // 온도가 같음
      if (currentWeather.temp >= 15) {
        temperatureCompareMessage = this.parseTemperatureMessage(
          TemperatureType[4],
        );
      } else {
        temperatureCompareMessage = this.parseTemperatureMessage(
          TemperatureType[5],
        );
      }
    }

    const temperatureData = historicalWeatherInfo.map((weather) => {
      return weather.temp;
    });
    const maxTemperatureMessage = this.parseTemperatureMessage(
      TemperatureType[6],
      Math.max(...temperatureData),
    );
    const minTemperatureMessage = this.parseTemperatureMessage(
      TemperatureType[7],
      Math.min(...temperatureData),
    );
    const temperatureMessage =
      temperatureCompareMessage + maxTemperatureMessage + minTemperatureMessage;

    weather.setTemperatureMessage(temperatureMessage);
  }

  async setForecastMessage(weather: Weather, days = 2): Promise<void> {
    const allForecast = [];
    for (let i = 0; i < days; i++) {
      const dailyForecast = [];
      for (let j = 1; j <= 4; j++) {
        dailyForecast.push(() =>
          this.getForecastWeather(weather, (4 * i + j) * 6),
        );
      }
      allForecast.push(dailyForecast);
    }

    const forecastInfo: ForecastApiResponse[][] = await Promise.all(
      allForecast.map(
        async (data) =>
          await Promise.all(
            data.map((func) => {
              return func();
            }),
          ),
      ),
    );
    let headsUpMessage: HeadsUpType = null;

    // 현재 기획
    const firstDayForecast = forecastInfo[0];
    const allDayForecast = [...forecastInfo[0], ...forecastInfo[1]];
    if (this.checkWeatherForecast(firstDayForecast, 2, WeatherCode.snow)) {
      headsUpMessage = HeadsUpType[0];
    } else if (this.checkWeatherForecast(allDayForecast, 2, WeatherCode.snow)) {
      headsUpMessage = HeadsUpType[1];
    } else if (
      this.checkWeatherForecast(firstDayForecast, 2, WeatherCode.rain)
    ) {
      headsUpMessage = HeadsUpType[2];
    } else if (this.checkWeatherForecast(allDayForecast, 2, WeatherCode.rain)) {
      headsUpMessage = HeadsUpType[3];
    } else {
      headsUpMessage = HeadsUpType[4];
    }
    weather.setHeadsUpMessage(headsUpMessage);
  }

  private parseTemperatureMessage(
    temperatureMessage: TemperatureType,
    targetTemperature?: number,
  ): string {
    if (!targetTemperature) return temperatureMessage;
    let temperature: number = targetTemperature;
    if (
      temperatureMessage !== TemperatureType[6] &&
      temperatureMessage !== TemperatureType[7] &&
      targetTemperature < 0
    ) {
      temperature = targetTemperature * -1;
    }
    return temperatureMessage.replace('n', temperature.toString());
  }

  private checkWeatherForecast(
    weatherList: ForecastApiResponse[],
    minHoursCount: number,
    weatherType: WeatherCode,
  ): boolean {
    const weatherCodeList = weatherList.map((weather) => weather.code);
    return (
      weatherCodeList.filter((weatherCode) => weatherCode === weatherType)
        .length >= minHoursCount
    );
  }
}
