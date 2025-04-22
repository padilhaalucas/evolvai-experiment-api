import { Injectable } from '@nestjs/common';
import { ExperimentsRepository } from '../repositories/experiments.repository';
import { ExperimentDto } from '../dto/experiment.dto';

@Injectable()
export class ExperimentsService {
  constructor(private readonly experimentsRepository: ExperimentsRepository) {}

  async findOne(id: string): Promise<ExperimentDto> {
    return this.experimentsRepository.findById(id);
  }
}