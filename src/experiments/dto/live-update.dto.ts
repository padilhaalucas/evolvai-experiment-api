import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { VariantDto } from "./variant.dto";

export class LiveUpdateDto {
  @ApiProperty({ example: '2024-12-27T14:00:00Z' })
  @IsString()
  timestamp: string;

  @ApiProperty({ type: VariantDto })
  @IsObject()
  @ValidateNested()
  @Type(() => VariantDto)
  control: Omit<VariantDto, 'name'>;

  @ApiProperty({ type: VariantDto })
  @IsObject()
  @ValidateNested()
  @Type(() => VariantDto)
  variantB: Omit<VariantDto, 'name'>;
}