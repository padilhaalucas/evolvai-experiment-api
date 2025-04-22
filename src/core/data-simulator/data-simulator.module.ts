import { Module, Global } from '@nestjs/common';
import { DataSimulatorService } from "./data-simulator.service";

@Global()
@Module({
  providers: [DataSimulatorService],
  exports: [DataSimulatorService],
})
export class CoreModule {}