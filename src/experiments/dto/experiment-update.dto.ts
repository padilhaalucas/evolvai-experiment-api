import { ApiProperty } from '@nestjs/swagger';
import { LiveUpdateDto } from './live-update.dto';
import { ExperimentMode } from '../types/experiment-mode.type';

export class ExperimentUpdateMetaDto {
  @ApiProperty({ example: 5000 })
  interval: number;

  @ApiProperty({ example: 'neutral', enum: ['rabbit', 'turtle', 'neutral'] })
  mode: ExperimentMode;

  @ApiProperty({ example: 0 })
  index: number;
}

export class ExperimentUpdateDto {
  @ApiProperty({ type: LiveUpdateDto })
  data: LiveUpdateDto;

  @ApiProperty({ type: ExperimentUpdateMetaDto })
  meta: ExperimentUpdateMetaDto;
}