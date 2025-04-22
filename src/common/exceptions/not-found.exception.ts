import { NotFoundException } from '@nestjs/common';

export class ExperimentNotFoundException extends NotFoundException {
  constructor(experimentId: string) {
    super(`Experiment with ID "${experimentId}" not found`);
  }
}