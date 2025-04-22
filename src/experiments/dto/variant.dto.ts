import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class VariantDto {
  @ApiProperty({ example: 'Control' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  visitors: number;

  @ApiProperty({ example: 250 })
  @IsNumber()
  conversions: number;

  @ApiProperty({ example: 4800 })
  @IsNumber()
  revenue: number;
}