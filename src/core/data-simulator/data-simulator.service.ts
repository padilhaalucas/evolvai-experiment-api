import { Injectable } from '@nestjs/common';

import { ExperimentDto } from "../../experiments/dto/experiment.dto";
import { LiveUpdateDto } from "../../experiments/dto/live-update.dto";

@Injectable()
export class DataSimulatorService {
  private experiments: Map<string, ExperimentDto> = new Map();

  constructor() {
    this.initializeExperiment('exp_live_001');
  }

  private initializeExperiment(experimentId: string): void {
    const experiment: ExperimentDto = {
      experimentId,
      variants: [
        {
          name: 'Control',
          visitors: 0,
          conversions: 0,
          revenue: 0,
        },
        {
          name: 'Variant B',
          visitors: 0,
          conversions: 0,
          revenue: 0,
        },
      ],
      liveUpdates: [],
    };

    this.experiments.set(experimentId, experiment);
  }

  getExperiment(experimentId: string): ExperimentDto | null {
    if (!this.experiments.has(experimentId)) {
      this.initializeExperiment(experimentId);
    }
    return this.experiments.get(experimentId) || null;
  }

  getAllExperiments(): ExperimentDto[] {
    return Array.from(this.experiments.values());
  }

  generateUpdate(experimentId: string): LiveUpdateDto | null {
    if (!this.experiments.has(experimentId)) {
      this.initializeExperiment(experimentId);
    }

    const experiment = this.experiments.get(experimentId);
    if (!experiment) return null;

    // Generate visitors with natural variance
    const baseVisitors = this.randomInt(15, 25);
    // Add slight randomness to create natural traffic imbalance
    const controlVisitors = Math.round(baseVisitors * this.randomFloat(0.9, 1.1));
    const variantVisitors = Math.round(baseVisitors * this.randomFloat(0.9, 1.1));

    // Set base conversion rates - variant B slightly better to show improvement
    const controlBaseRate = 0.2; // 20% conversion rate
    const variantBaseRate = 0.22; // 22% conversion rate

    // Total visitors so far - used to add slight randomness early in the experiment
    const totalControlVisits = experiment.variants[0].visitors;
    const totalVariantVisits = experiment.variants[1].visitors;

    // More randomness early in the experiment (when sample size is small)
    const controlRandomFactor = totalControlVisits < 500 ? 0.3 : 0.15;
    const variantRandomFactor = totalVariantVisits < 500 ? 0.3 : 0.15;

    // Calculate conversion rates with randomness
    const controlConvRate = controlBaseRate * this.randomFloat(1 - controlRandomFactor, 1 + controlRandomFactor);
    const variantConvRate = variantBaseRate * this.randomFloat(1 - variantRandomFactor, 1 + variantRandomFactor);

    // Calculate conversions
    const controlConversions = Math.round(controlVisitors * controlConvRate);
    const variantConversions = Math.round(variantVisitors * variantConvRate);

    // Calculate revenue - set AOV with slight randomness and occasional large orders
    const controlRevenue = this.calculateRevenue(controlConversions);
    const variantRevenue = this.calculateRevenue(variantConversions);

    const update: LiveUpdateDto = {
      timestamp: new Date().toISOString(),
      control: {
        visitors: controlVisitors,
        conversions: controlConversions,
        revenue: controlRevenue,
      },
      variantB: {
        visitors: variantVisitors,
        conversions: variantConversions,
        revenue: variantRevenue,
      },
    };

    // Update the experiment with this new data
    experiment.liveUpdates.push(update);
    experiment.variants[0].visitors += controlVisitors;
    experiment.variants[0].conversions += controlConversions;
    experiment.variants[0].revenue += controlRevenue;
    experiment.variants[1].visitors += variantVisitors;
    experiment.variants[1].conversions += variantConversions;
    experiment.variants[1].revenue += variantRevenue;

    // Keep only the last 20 updates
    if (experiment.liveUpdates.length > 20) {
      experiment.liveUpdates = experiment.liveUpdates.slice(-20);
    }

    return update;
  }

  private calculateRevenue(conversions: number): number {
    if (conversions === 0) return 0;

    let total = 0;

    // Process each conversion individually
    for (let i = 0; i < conversions; i++) {
      // Base price between $18-25
      let orderValue = this.randomInt(18, 25);

      // 5% chance of a large order
      if (Math.random() < 0.05) {
        orderValue = this.randomInt(60, 120);
      }

      total += orderValue;
    }

    return total;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
