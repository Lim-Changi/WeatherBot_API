import { GreetingType, HeadsUpType } from './WeatherMessageType';

export class Weather {
  private greeting: GreetingType;
  private temperature: string;
  private headsUp: HeadsUpType;
  lat: string;
  lon: string;

  static location(lat: string, lon: string) {
    const weather = new Weather();
    weather.lat = lat;
    weather.lon = lon;

    return weather;
  }

  setGreetingMessage(greeting: GreetingType) {
    this.greeting = greeting;
    return this;
  }

  setTemperatureMessage(temperature: string) {
    this.temperature = temperature;
    return this;
  }

  setHeadsUpMessage(headsUp: HeadsUpType) {
    this.headsUp = headsUp;
    return this;
  }

  summary() {
    return {
      greeting: this.greeting,
      temperature: this.temperature,
      headsUp: this.headsUp,
    };
  }
}
