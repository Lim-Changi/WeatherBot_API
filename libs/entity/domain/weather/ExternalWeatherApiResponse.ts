export interface CurrentWeatherApiResponse {
  timestamp: number;
  code: WeatherCode;
  temp: number;
  rain1h: number;
}

export interface ForecastWeatherApiResponse {
  timestamp: number;
  code: WeatherCode;
  temp: number;
  min_temp: number;
  max_temp: number;
  rain: number;
}

export interface HistoricalWeatherApiResponse {
  timestamp: number;
  code: WeatherCode;
  temp: number;
  rain1h: number;
}

export const WeatherCode = {
  0: '맑음',
  1: '흐림',
  2: '비',
  3: '눈',
} as const;

export type WeatherCode = typeof WeatherCode[keyof typeof WeatherCode];
