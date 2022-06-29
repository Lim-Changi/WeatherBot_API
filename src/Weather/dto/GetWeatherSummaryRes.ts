import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Weather } from '@app/entity/domain/weather/weather.entity';
import {
  GreetingType,
  HeadsUpType,
  TemperatureType,
} from '@app/entity/domain/weather/WeatherMessageType';

export class GetWeatherSummaryRes {
  @ApiProperty({
    enum: GreetingType,
  })
  @Exclude()
  private readonly _greeting: GreetingType;

  @ApiProperty({
    enum: TemperatureType,
  })
  @Exclude()
  private readonly _temperature: string;

  @ApiProperty({
    enum: HeadsUpType,
  })
  @Exclude()
  private readonly _headsUp: HeadsUpType;

  constructor(weatherSummary: Weather) {
    this._greeting = weatherSummary.summary().greeting;
    this._temperature = weatherSummary.summary().temperature;
    this._headsUp = weatherSummary.summary().headsUp;
  }

  @Expose()
  get summary() {
    return {
      greeting: this._greeting,
      temperature: this._temperature,
      'heads-up': this._headsUp,
    };
  }
}
