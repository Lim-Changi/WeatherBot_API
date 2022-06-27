import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { GetWeatherSummaryRes } from 'src/Weather/dto/GetWeatherSummaryRes';

@ApiExtraModels()
export class GetWeatherSummarySuccess {
  @ApiProperty({
    type: GetWeatherSummaryRes,
    title: '성공 데이터',
    example: {
      greeting: '날씨가 참 맑습니다.',
      temperature:
        '어제보다 4도 가량 춥습니다. 최고기온은 10도 최저기온은 3도 입니다.',
      'heads-up': '내일 폭설이 내릴 수도 있으니 외출 시 주의하세요.',
    },
    description: '나라별 상품 조회에 성공했습니다.',
  })
  summary: GetWeatherSummaryRes;
}
