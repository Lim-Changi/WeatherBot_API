import { Weather } from '@app/entity/domain/weather/Weather.entity';
import { generateRandomLatLon } from '@test/tools/ci-tools';

describe('Weather Entity', () => {
  it('위도 경도값을 입력하면 날씨 객체 생성', () => {
    const { lat, lon } = generateRandomLatLon();
    const weatherTest = Weather.location(lat, lon);
    expect(weatherTest).toBeInstanceOf(Weather);
  });

  it('날씨 정보 메시지 입력시, 조회 성공', () => {
    const weatherTest = new Weather();
    weatherTest.setGreetingMessage('날씨가 약간은 칙칙해요.');
    weatherTest.setTemperatureMessage('Temperature Message');
    weatherTest.setHeadsUpMessage('날씨는 대체로 평온할 예정이에요.');

    const weatherMsg = weatherTest.summary();
    expect(weatherMsg).toHaveProperty('greeting');
    expect(weatherMsg).toHaveProperty('temperature');
    expect(weatherMsg).toHaveProperty('headsUp');
  });
});
