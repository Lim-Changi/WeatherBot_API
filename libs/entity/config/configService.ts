import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

class WeatherAPI {
  readonly CURRENT_URL: string;
  readonly FORECAST_URL: string;
  readonly HISTORICAL_URL: string;
}

@Injectable()
export class ConfigService {
  static appPort(): number {
    const { PORT } = process.env;
    return PORT ? Number(PORT) : 8080;
  }

  static weatherAPI(): WeatherAPI {
    const {
      WEATHER_API_HOST,
      CURRENT_ENDPOINT,
      FORECAST_ENDPOINT,
      HISTORICAL_ENDPOINT,
      API_KEY,
    } = process.env;
    const CURRENT_URL = WEATHER_API_HOST + CURRENT_ENDPOINT + API_KEY;
    const FORECAST_URL = WEATHER_API_HOST + FORECAST_ENDPOINT + API_KEY;
    const HISTORICAL_URL = WEATHER_API_HOST + HISTORICAL_ENDPOINT + API_KEY;

    return { CURRENT_URL, FORECAST_URL, HISTORICAL_URL };
  }
}
