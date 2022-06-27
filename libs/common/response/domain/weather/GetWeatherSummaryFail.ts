import { HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class GetWeatherSummaryFail {
  @ApiProperty({
    type: 'number',
    description: 'HTTP Error Code입니다.',
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    title: 'Error 메시지',
    example: '날씨 조회 로직이 실패했습니다.',
  })
  message: string;
}
