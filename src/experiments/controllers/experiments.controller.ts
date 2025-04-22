import { Controller, Get, Post, Body, Param, Sse, MessageEvent } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { ExperimentsService } from '../services/experiments.service';
import { ExperimentEventsService } from '../services/experiment-events.service';
import { ExperimentDto } from '../dto/experiment.dto';
import { IntervalUpdateDto } from '../dto/interval-update.dto';

@ApiTags('experiments')
@Controller('api/experiments')
export class ExperimentsController {
  constructor(
    private readonly experimentsService: ExperimentsService,
    private readonly eventsService: ExperimentEventsService,
  ) {}
  @Get(':id/metrics')
  @ApiOperation({ summary: 'Get metrics for a specific experiment' })
  @ApiResponse({
    status: 200,
    description: 'Experiment metrics',
    type: ExperimentDto
  })
  findOne(@Param('id') id: string): Promise<ExperimentDto> {
    return this.experimentsService.findOne(id);
  }

  @Sse(':id/events')
  @ApiOperation({ summary: 'Subscribe to experiment events via SSE' })
  @ApiResponse({
    status: 200,
    description: 'Server-Sent Events stream for experiment updates'
  })
  events(@Param('id') id: string): Observable<MessageEvent> {
    return this.eventsService.experimentUpdates(id).pipe(
      map((payload) => ({
        type: 'experiment-update',
        data: payload
      }))
    );
  }

  @Post(':id/interval')
  @ApiOperation({ summary: 'Set the update interval for an experiment' })
  @ApiResponse({ status: 200, description: 'Interval updated successfully' })
  setInterval(
    @Param('id') id: string,
    @Body() intervalUpdateDto: IntervalUpdateDto,
  ): { success: boolean } {
    this.eventsService.setInterval(id, intervalUpdateDto.interval);
    return { success: true };
  }
}