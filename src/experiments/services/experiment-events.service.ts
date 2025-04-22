import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable, switchMap, interval, mergeMap } from 'rxjs';
import { ExperimentsRepository } from '../repositories/experiments.repository';
import { ExperimentMode } from '../types/experiment-mode.type';
import { ExperimentUpdateDto } from '../dto/experiment-update.dto';
import { INTERVAL_OPTIONS } from "../../common/constants/intervals.constants";

@Injectable()
export class ExperimentEventsService {
  constructor(private readonly experimentsRepository: ExperimentsRepository) {}

  private intervalSubjects: Map<string, BehaviorSubject<number>> = new Map();

  private getMode(interval: number): ExperimentMode {
    if (interval <= 2000) return 'rabbit';
    if (interval >= 60000) return 'turtle';
    return 'neutral';
  }

  private getIndex(mode: ExperimentMode, interval: number): number {
    return INTERVAL_OPTIONS[mode].findIndex((opt) => opt === interval);
  }

  private getOrCreateSubject(experimentId: string): BehaviorSubject<number> {
    if (!this.intervalSubjects.has(experimentId)) {
      this.intervalSubjects.set(experimentId, new BehaviorSubject(5000));
    }
    return this.intervalSubjects.get(experimentId)!;
  }

  experimentUpdates(experimentId: string): Observable<ExperimentUpdateDto> {
    return this.getOrCreateSubject(experimentId).pipe(
      switchMap((intervalTime) =>
        interval(intervalTime).pipe(
          mergeMap(async () => {
            const currentInterval = intervalTime;
            const mode = this.getMode(currentInterval);
            const index = this.getIndex(mode, currentInterval);

            const update = await this.experimentsRepository.generateUpdate(experimentId);

            return {
              data: update,
              meta: {
                interval: currentInterval,
                mode,
                index
              }
            };
          })
        )
      )
    );
  }

  setInterval(experimentId: string, interval: number): void {
    if (!this.intervalSubjects.has(experimentId)) {
      this.intervalSubjects.set(experimentId, new BehaviorSubject(interval));
    } else {
      this.getOrCreateSubject(experimentId).next(interval);
    }
  }
}