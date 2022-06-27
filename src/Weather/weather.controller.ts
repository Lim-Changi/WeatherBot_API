import { GetWeatherSummaryBadRequest } from '@app/common/response/domain/weather/GetWeatherSummaryBadRequest';
import { GetWeatherSummaryFail } from '@app/common/response/domain/weather/GetWeatherSummaryFail';
import { GetWeatherSummarySuccess } from '@app/common/response/domain/weather/GetWeatherSummarySuccess';
import { GetWeatherSummaryTimeout } from '@app/common/response/domain/weather/GetWeatherSummaryTimeout';
import { ResponseEntity } from '@app/common/response/ResponseEntity';
import { TimeoutInterceptor } from '@app/common/timeout/timeout.interceptor';
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiRequestTimeoutResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetWeatherSummaryReq } from './dto/GetWeatherSummaryReq';
import { GetWeatherSummaryRes } from './dto/GetWeatherSummaryRes';
import { WeatherService } from './weather.service';

@Controller()
@ApiTags('날씨 API')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @ApiOperation({
    summary: '날씨 정보 조회',
  })
  @ApiOkResponse({
    description: '해당 위치의 날씨 정보 조회에 성공했습니다.',
    type: GetWeatherSummarySuccess,
  })
  @ApiBadRequestResponse({
    type: GetWeatherSummaryBadRequest,
  })
  @ApiRequestTimeoutResponse({
    type: GetWeatherSummaryTimeout,
  })
  @ApiInternalServerErrorResponse({
    type: GetWeatherSummaryFail,
  })
  @UseInterceptors(TimeoutInterceptor)
  @Get('/summary')
  async getWeatherSummary(
    @Query() param: GetWeatherSummaryReq,
  ): Promise<GetWeatherSummaryRes> {
    try {
      const weatherEntity = param.toEntity();
      return ResponseEntity.ONLY_DATA(new GetWeatherSummaryRes(weatherEntity));
    } catch (e) {
      throw ResponseEntity.ERROR_WITH_DATA(
        '날씨 조회 로직이 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }
  }
}
