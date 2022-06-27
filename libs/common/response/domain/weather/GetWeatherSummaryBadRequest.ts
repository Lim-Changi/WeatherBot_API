import { HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class GetWeatherSummaryBadRequest {
  @ApiProperty({
    type: 'number',
    description: 'HTTP Error Code입니다.',
    example: HttpStatus.BAD_REQUEST,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    title: 'BadRequest Error 메시지',
    example: '정상적인 위도 경도값을 입력 해야합니다.',
  })
  message: string;
}
