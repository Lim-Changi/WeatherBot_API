import { Weather } from '@app/entity/domain/weather/weather.entity';
import { HttpService } from '@nestjs/axios';
import { generateRandomLatLon } from '@test/tools/ci-tools';
import { WeatherInfoService } from '../../../../src/Weather/adapter/weatherInfo.service';

describe('외부 날씨 Api 조회 테스트 ', () => {
  const httpService = new HttpService();
  const testWeatherInfoService = new WeatherInfoService(httpService);
  let testWeather: Weather;
  beforeEach(() => {
    const { lat, lon } = generateRandomLatLon();
    testWeather = Weather.location(lat, lon);
  });

  describe('현재 날씨 정보', () => {
    it('현재 날씨 정보 조회 성공', async () => {
      const currentWeather = await testWeatherInfoService.getCurrentWeather(
        testWeather,
      );
      expect(typeof currentWeather.timestamp).toBe('number');
      expect(typeof currentWeather.code).toBe('number');
      expect(typeof currentWeather.temp).toBe('number');
      expect(typeof currentWeather.rain1h).toBe('number');
    });

    it('비정상 위도 경도 값 입력시, 조회 실패 400', async () => {
      expect.assertions(1);
      testWeather = Weather.location('100', '200');
      try {
        await testWeatherInfoService.getCurrentWeather(testWeather);
      } catch (err) {
        expect(err).toHaveProperty('statusCode', 400);
      }
    });
  });

  describe('과거 날씨 정보', () => {
    it('과거 날씨 정보 조회 성공', async () => {
      const pastWeather = await testWeatherInfoService.getHistoricalWeather(
        testWeather,
        -6,
      );

      expect(typeof pastWeather.timestamp).toBe('number');
      expect(typeof pastWeather.code).toBe('number');
      expect(typeof pastWeather.temp).toBe('number');
      expect(typeof pastWeather.rain1h).toBe('number');
    });

    it('비정상 위도 경도 값 입력시, 조회 실패 400', async () => {
      expect.assertions(1);
      testWeather = Weather.location('100', '200');
      try {
        await testWeatherInfoService.getHistoricalWeather(testWeather, -6);
      } catch (err) {
        expect(err).toHaveProperty('statusCode', 400);
      }
    });

    it('비정상 시간 값 (-6이하의 6의 배수가 아닌 수) 입력시, 조회 실패 400', async () => {
      expect.assertions(3);
      try {
        await testWeatherInfoService.getHistoricalWeather(testWeather, 0);
      } catch (err) {
        expect(err).toHaveProperty('statusCode', 400);
      }

      try {
        await testWeatherInfoService.getHistoricalWeather(testWeather, 6);
      } catch (err) {
        expect(err).toHaveProperty('statusCode', 400);
      }

      try {
        await testWeatherInfoService.getHistoricalWeather(testWeather, -2);
      } catch (err) {
        expect(err).toHaveProperty('statusCode', 400);
      }
    });
  });

  describe('날씨 예보', () => {
    it('날씨 예보 조회 성공', async () => {
      const weatherForecast = await testWeatherInfoService.getForecastWeather(
        testWeather,
        6,
      );

      expect(typeof weatherForecast.timestamp).toBe('number');
      expect(typeof weatherForecast.code).toBe('number');
      expect(typeof weatherForecast.min_temp).toBe('number');
      expect(typeof weatherForecast.max_temp).toBe('number');
      expect(typeof weatherForecast.rain).toBe('number');
    });

    it('비정상 위도 경도 값 입력시, 조회 실패 400', async () => {
      expect.assertions(1);
      testWeather = Weather.location('100', '200');
      try {
        await testWeatherInfoService.getForecastWeather(testWeather, 6);
      } catch (err) {
        expect(err).toHaveProperty('statusCode', 400);
      }
    });

    it('비정상 시간 값 (6 이상, 72 이하의 6의 배수가 아닌 수) 입력시, 조회 실패 400', async () => {
      expect.assertions(3);
      try {
        await testWeatherInfoService.getForecastWeather(testWeather, -6);
      } catch (err) {
        expect(err).toHaveProperty('statusCode', 400);
      }
      try {
        await testWeatherInfoService.getForecastWeather(testWeather, 3);
      } catch (err) {
        expect(err).toHaveProperty('statusCode', 400);
      }

      try {
        await testWeatherInfoService.getForecastWeather(testWeather, 78);
      } catch (err) {
        expect(err).toHaveProperty('statusCode', 400);
      }
    });
  });
});
