import { Module } from '@nestjs/common'
import { ParkEntriesService } from './park-entries.service'
import { ParkEntriesController } from './park-entries.controller'
import { ParksModule } from 'src/parks/parks.module'
import { VehiclesModule } from 'src/vehicles/vehicles.module'
import { ParkEntriesResolver } from './park-entries.resolver';

@Module({
  providers: [ParkEntriesService, ParkEntriesResolver],
  controllers: [ParkEntriesController],
  imports: [ParksModule, VehiclesModule],
})
export class ParkEntriesModule {}
