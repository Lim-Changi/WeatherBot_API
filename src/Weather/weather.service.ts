import { Injectable } from '@nestjs/common';
import {
  ForecastApiResponse,
  WeatherApiResponse,
  WeatherCode,
} from '@app/entity/domain/weather/WeatherInfoApiResponse';
import { Weather } from '@app/entity/domain/weather/weather.entity';
import {
  GreetingType,
  HeadsUpType,
  TemperatureType,
} from '@app/entity/domain/weather/WeatherMessageType';
import { WeatherInfoService } from './adapter/weatherInfo.service';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherInfoService: WeatherInfoService) {}

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

  private setTemperatureMessage(
    currentWeather: WeatherApiResponse,
    historicalWeatherInfo: WeatherApiResponse[],
    days: number,
    weather: Weather,
  ): void {
    // 기획
    let temperatureCompareMessage: string = null;
    const lastDayTemperatureInfo = historicalWeatherInfo[4 * days];
    const temperatureDifference =
      currentWeather.temp - lastDayTemperatureInfo.temp;

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
        temperatureCompareMessage = TemperatureType[4];
      } else {
        temperatureCompareMessage = TemperatureType[5];
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

  async setWeatherMessage(weather: Weather, days = 1): Promise<void> {
    try {
      const historicalWeather = [
        this.weatherInfoService.getCurrentWeather(weather),
      ]; // 현재 날씨

      for (let i = 0; i < days; i++) {
        for (let j = 1; j <= 4; j++) {
          historicalWeather.push(
            this.weatherInfoService.getHistoricalWeather(
              weather,
              -(4 * i + j) * 6,
            ), // 과거 날씨
          );
        }
      }
      const historicalWeatherInfo: WeatherApiResponse[] = await Promise.all(
        historicalWeather,
      );

      const currentWeather = historicalWeatherInfo[0];

      // Greeting Message
      this.setGreetingMessage(currentWeather, weather);

      // Temperature Message
      this.setTemperatureMessage(
        currentWeather,
        historicalWeatherInfo,
        days,
        weather,
      );
    } catch (e) {
      throw e;
    }
  }

  async setForecastMessage(weather: Weather, days = 2): Promise<void> {
    try {
      const allForecast = [];
      for (let i = 0; i < days; i++) {
        const dailyForecast = [];
        for (let j = 1; j <= 4; j++) {
          dailyForecast.push(
            this.weatherInfoService.getForecastWeather(
              weather,
              (4 * i + j) * 6,
            ),
          );
        }
        allForecast.push(dailyForecast);
      }

      const forecastInfo: ForecastApiResponse[][] = await Promise.all(
        allForecast.map(async (data) => await Promise.all(data)),
      );
      let headsUpMessage: HeadsUpType = null;

      // 현재 기획
      const firstDayForecast = forecastInfo[0];
      const allDayForecast = [...forecastInfo[0], ...forecastInfo[1]];
      if (this.checkWeatherForecast(firstDayForecast, 2, WeatherCode.snow)) {
        headsUpMessage = HeadsUpType[0];
      } else if (
        this.checkWeatherForecast(allDayForecast, 2, WeatherCode.snow)
      ) {
        headsUpMessage = HeadsUpType[1];
      } else if (
        this.checkWeatherForecast(firstDayForecast, 2, WeatherCode.rain)
      ) {
        headsUpMessage = HeadsUpType[2];
      } else if (
        this.checkWeatherForecast(allDayForecast, 2, WeatherCode.rain)
      ) {
        headsUpMessage = HeadsUpType[3];
      } else {
        headsUpMessage = HeadsUpType[4];
      }
      weather.setHeadsUpMessage(headsUpMessage);
    } catch (e) {
      throw e;
    }
  }

  private parseTemperatureMessage(
    temperatureMessage: TemperatureType,
    targetTemperature?: number,
  ): string {
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
