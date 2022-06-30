import { HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class GetWeatherSummaryTimeout {
  @ApiProperty({
    type: 'number',
    description: 'HTTP Error Code입니다.',
    example: HttpStatus.REQUEST_TIMEOUT,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    title: 'Request Timeout Error 메시지',
    example: '전체 요청 소요시간이 1500ms 을 넘어갔습니다.',
  })
  message: string;
}
