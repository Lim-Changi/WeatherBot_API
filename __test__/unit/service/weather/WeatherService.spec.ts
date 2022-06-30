import { Weather } from '@app/entity/domain/weather/weather.entity';
import { GreetingType } from '@app/entity/domain/weather/WeatherMessageType';
import { HttpService } from '@nestjs/axios';
import { WeatherInfoServiceStub } from '@test/stub/WeatherInfoServiceStub';
import {
  generateRandomLatLon,
  generateRandomRain,
  generateRandomTemp,
  generateRandomWeatherCode,
} from '@test/tools/ci-tools';
import { WeatherService } from '../../../../src/Weather/weather.service';
import { WeatherCode } from '@app/entity/domain/weather/WeatherInfoApiResponse';
describe('Weather Service', () => {
  const httpService = new HttpService();
  const testWeatherInfoService = new WeatherInfoServiceStub(httpService);
  const testWeatherService = new WeatherService(testWeatherInfoService);
  let testWeather: Weather;
  let testWeatherCode: WeatherCode;
  let testTemperature: number;
  let testRain: number;

  beforeEach(() => {
    const { lat, lon } = generateRandomLatLon();
    testWeather = Weather.location(lat, lon);
    testWeatherCode = generateRandomWeatherCode();
    testTemperature = generateRandomTemp();
    testRain = generateRandomRain();
  });

  describe.skip('현재 날씨 정보, Greeting Message', () => {
    it('현재 날씨가 눈, 강수량이 100mm 이상 => 폭설이 내리고 있어요', async () => {
      testWeatherInfoService.setTestWeatherInfo(
        WeatherCode.snow,
        testTemperature,
        150,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().greeting).toBe(GreetingType[0]);
    });
    it('현재 날씨가 눈, 강수량이 100mm 미만 => 눈이 포슬포슬 내립니다.', async () => {
      testWeatherInfoService.setTestWeatherInfo(
        WeatherCode.snow,
        testTemperature,
        50,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().greeting).toBe(GreetingType[1]);
    });
    it('현재 날씨가 비, 강수량이 100mm 이상 => 폭우가 내리고 있어요.', async () => {
      testWeatherInfoService.setTestWeatherInfo(
        WeatherCode.rain,
        testTemperature,
        150,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().greeting).toBe(GreetingType[2]);
    });
    it('현재 날씨가 비, 강수량이 100mm 미만 => 비가 오고 있습니다.', async () => {
      testWeatherInfoService.setTestWeatherInfo(
        WeatherCode.rain,
        testTemperature,
        50,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().greeting).toBe(GreetingType[3]);
    });
    it('현재 날씨가 흐림 => 날씨가 약간은 칙칙해요.', async () => {
      testWeatherInfoService.setTestWeatherInfo(
        WeatherCode.cloudy,
        testTemperature,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().greeting).toBe(GreetingType[4]);
    });
    it('현재 날씨가 맑음, 현재 온도 30도 이상 => 따사로운 햇살을 맞으세요.', async () => {
      testWeatherInfoService.setTestWeatherInfo(
        WeatherCode.sunny,
        50,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().greeting).toBe(GreetingType[5]);
    });
    it('현재 날씨가 맑음, 현재 온도 0도 이하 => 날이 참 춥네요.', async () => {
      testWeatherInfoService.setTestWeatherInfo(
        WeatherCode.sunny,
        -50,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().greeting).toBe(GreetingType[6]);
    });
    it('현재 날씨가 맑음, 0 < 현재 온도 < 30  => 날씨가 참 맑습니다.', async () => {
      testWeatherInfoService.setTestWeatherInfo(
        WeatherCode.sunny,
        15,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().greeting).toBe(GreetingType[7]);
    });
  });

  describe('비교 날씨 정보, Temperature Message', () => {
    it('온도 n도 하락, 현재 온도 15도 이상 => 어제보다 n도 덜 덥습니다.', async () => {
      const currentTemp = 30;
      const tempDifference = 15;
      testWeatherInfoService.setTestWeatherInfo(
        testWeatherCode,
        currentTemp,
        testRain,
      );
      testWeatherInfoService.setTestHistoricalWeatherInfo(
        testWeatherCode,
        currentTemp + tempDifference,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().temperature).toContain(
        `어제보다 ${tempDifference}도 덜 덥습니다.`,
      );
    });

    it('온도 n도 하락, 현재 온도 15도 미만 => 어제보다 n도 더 춥습니다.', async () => {
      const currentTemp = 5;
      const tempDifference = 15;
      testWeatherInfoService.setTestWeatherInfo(
        testWeatherCode,
        currentTemp,
        testRain,
      );
      testWeatherInfoService.setTestHistoricalWeatherInfo(
        testWeatherCode,
        currentTemp + tempDifference,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().temperature).toContain(
        `어제보다 ${tempDifference}도 더 춥습니다.`,
      );
    });

    it('온도 n도 상승, 현재 온도 15도 이상 => 어제보다 n도 더 덥습니다.', async () => {
      const currentTemp = 30;
      const tempDifference = 15;
      testWeatherInfoService.setTestWeatherInfo(
        testWeatherCode,
        currentTemp,
        testRain,
      );
      testWeatherInfoService.setTestHistoricalWeatherInfo(
        testWeatherCode,
        currentTemp - tempDifference,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().temperature).toContain(
        `어제보다 ${tempDifference}도 더 덥습니다.`,
      );
    });

    it('온도 n도 상승, 현재 온도 15도 미만 => 어제보다 n도 덜 춥습니다.', async () => {
      const currentTemp = 5;
      const tempDifference = 15;
      testWeatherInfoService.setTestWeatherInfo(
        testWeatherCode,
        currentTemp,
        testRain,
      );
      testWeatherInfoService.setTestHistoricalWeatherInfo(
        testWeatherCode,
        currentTemp - tempDifference,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().temperature).toContain(
        `어제보다 ${tempDifference}도 덜 춥습니다.`,
      );
    });

    it('온도 동일, 현재 온도 15도 이상 => 어제와 비슷하게 덥습니다.', async () => {
      const currentTemp = 30;
      const tempDifference = 0;
      testWeatherInfoService.setTestWeatherInfo(
        testWeatherCode,
        currentTemp,
        testRain,
      );
      testWeatherInfoService.setTestHistoricalWeatherInfo(
        testWeatherCode,
        currentTemp + tempDifference,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().temperature).toContain(
        `어제와 비슷하게 덥습니다.`,
      );
    });

    it('온도 동일, 현재 온도 15도 미만 => 어제와 비슷하게 춥습니다.', async () => {
      const currentTemp = 5;
      const tempDifference = 0;
      testWeatherInfoService.setTestWeatherInfo(
        testWeatherCode,
        currentTemp,
        testRain,
      );
      testWeatherInfoService.setTestHistoricalWeatherInfo(
        testWeatherCode,
        currentTemp + tempDifference,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().temperature).toContain(
        `어제와 비슷하게 춥습니다.`,
      );
    });

    it('측정치 중 가장 높은 온도 n => 최고기온은 n도,', async () => {
      const maxTemp = 100;
      const minTemp = 0;
      testWeatherInfoService.setTestWeatherInfo(
        testWeatherCode,
        maxTemp,
        testRain,
      );
      testWeatherInfoService.setTestHistoricalWeatherInfo(
        testWeatherCode,
        minTemp,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().temperature).toContain(
        `최고기온은 ${maxTemp}도,`,
      );
    });

    it('측정치 중 가장 낮은 온도 n => 최저기온은 n도 입니다.', async () => {
      const maxTemp = 100;
      const minTemp = 0;
      testWeatherInfoService.setTestWeatherInfo(
        testWeatherCode,
        maxTemp,
        testRain,
      );
      testWeatherInfoService.setTestHistoricalWeatherInfo(
        testWeatherCode,
        minTemp,
        testRain,
      );
      await testWeatherService.setWeatherMessage(testWeather);
      expect(testWeather.summary().temperature).toContain(
        `최저기온은 ${minTemp}도 입니다.`,
      );
    });
  });

  describe('Forecast Message', () => {
    it.todo('날씨 서비스 기능 테스트');
  });
});
