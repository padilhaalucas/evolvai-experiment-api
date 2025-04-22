import { Module } from '@nestjs/common';
import { ExperimentsController } from './controllers/experiments.controller';
import { ExperimentsService } from './services/experiments.service';
import { ExperimentEventsService } from './services/experiment-events.service';
import { ExperimentsRepository } from './repositories/experiments.repository';

@Module({
  controllers: [ExperimentsController],
  providers: [
    ExperimentsService,
    ExperimentEventsService,
    ExperimentsRepository,
  ],
})
export class ExperimentsModule {}