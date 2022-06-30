import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
import { Weather } from '@app/entity/domain/weather/Weather.entity';

export class GetWeatherSummaryReq {
  @ApiProperty({
    example: 14.3,
    description: '위도 값 입니다. (최대: 90, 최소: -90)',
    required: true,
    maximum: 90,
    minimum: -90,
  })
  @Expose()
  @IsNotEmpty()
  @IsLatitude()
  lat: string;

  @ApiProperty({
    example: -175,
    description: '경도 값 입니다. (최대: 180, 최소: -180)',
    required: true,
    maximum: 180,
    minimum: -180,
  })
  @Expose()
  @IsNotEmpty()
  @IsLongitude()
  lon: string;

  toWeatherEntity(): Weather {
    return Weather.location(this.lat, this.lon);
  }
}
