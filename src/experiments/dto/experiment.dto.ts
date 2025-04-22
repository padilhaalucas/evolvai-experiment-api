import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { VariantDto } from './variant.dto';
import { LiveUpdateDto } from './live-update.dto';

export class ExperimentDto {
  @ApiProperty({ example: 'exp_live_001' })
  @IsString()
  @IsNotEmpty()
  experimentId: string;

  @ApiProperty({ type: [VariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];

  @ApiProperty({ type: [LiveUpdateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LiveUpdateDto)
  liveUpdates: LiveUpdateDto[];
}