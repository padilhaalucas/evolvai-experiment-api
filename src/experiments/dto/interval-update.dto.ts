import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class IntervalUpdateDto {
  @ApiProperty({
    example: 5000,
    description: 'Update interval in milliseconds (500-60000)',
    minimum: 500,
    maximum: 60000,
  })
  @IsNumber()
  @Min(500)
  @Max(60000)
  interval: number;
}