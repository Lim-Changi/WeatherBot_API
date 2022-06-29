export interface WeatherApiResponse {
  timestamp: number;
  code: WeatherCode;
  temp: number;
  rain1h: number;
}

export interface ForecastApiResponse {
  timestamp: number;
  code: WeatherCode;
  min_temp: number;
  max_temp: number;
  rain: number;
}

export const WeatherCode = {
  sunny: 0,
  cloudy: 1,
  rain: 2,
  snow: 3,
} as const;

export type WeatherCode = typeof WeatherCode[keyof typeof WeatherCode];
