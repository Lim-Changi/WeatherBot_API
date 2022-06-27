import { Injectable } from '@nestjs/common';
import { Weather } from 'libs/entity/domain/weather/weather.entity';
import {
  GreetingType,
  HeadsUpType,
  TemperatureType,
} from 'libs/entity/domain/weather/WeatherMessageType';

@Injectable()
export class WeatherService {
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
