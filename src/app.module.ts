import { Module } from '@nestjs/common';
import { ExperimentsModule } from './experiments/experiments.module';
import { CoreModule } from "./core/data-simulator/data-simulator.module";

@Module({
  imports: [
    CoreModule,
    ExperimentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}