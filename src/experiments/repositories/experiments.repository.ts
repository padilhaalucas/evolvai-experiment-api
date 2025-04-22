import { Injectable } from '@nestjs/common';

import { ExperimentNotFoundException } from "../../common/exceptions/not-found.exception";
import { DataSimulatorService } from "../../core/data-simulator/data-simulator.service";
import { ExperimentDto } from "../dto/experiment.dto";
import { LiveUpdateDto } from "../dto/live-update.dto";

@Injectable()
export class ExperimentsRepository {
  constructor(private readonly dataSimulator: DataSimulatorService) {}

  async findAll(): Promise<ExperimentDto[]> {
    return this.dataSimulator.getAllExperiments();
  }

  async findById(id: string): Promise<ExperimentDto> {
    const experiment = this.dataSimulator.getExperiment(id);
    if (!experiment) {
      throw new ExperimentNotFoundException(id);
    }
    return experiment;
  }

  async generateUpdate(id: string): Promise<LiveUpdateDto> {
    const update = this.dataSimulator.generateUpdate(id);
    if (!update) {
      throw new ExperimentNotFoundException(id);
    }
    return update;
  }
}