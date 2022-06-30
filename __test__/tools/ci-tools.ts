import { WeatherCode } from '@app/entity/domain/weather/WeatherInfoApiResponse';

export function generateRandomLatLon(): { lat: string; lon: string } {
  const lat = (Math.round((Math.random() * 180 - 90) * 100) / 100).toString();
  const lon = (Math.round((Math.random() * 360 - 180) * 100) / 100).toString();
  return { lat, lon };
}

export function generateRandomWeatherCode(): WeatherCode {
  const weatherCodes = Object.keys(WeatherCode)
    .map((n) => Number.parseInt(n))
    .filter((n) => !Number.isNaN(n));
  const randomIndex = Math.floor(Math.random() * weatherCodes.length);
  const randomWeatherCode = weatherCodes[randomIndex] as WeatherCode;
  return randomWeatherCode;
}

export function generateRandomTemp(): number {
  return Math.round((Math.random() * 200 - 100) * 10) / 10;
}

export function generateRandomRain(): number {
  return Math.round(Math.random() * 2000);
}

export function generateRandomRainPercentage(): number {
  return Math.round(Math.random() * 100);
}
