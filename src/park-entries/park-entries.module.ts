import { Module } from '@nestjs/common'
import { ParkEntriesService } from './park-entries.service'
import { ParkEntriesController } from './park-entries.controller'
import { ParksModule } from 'src/parks/parks.module'
import { VehiclesModule } from 'src/vehicles/vehicles.module'

@Module({
  providers: [ParkEntriesService],
  controllers: [ParkEntriesController],
  imports: [ParksModule, VehiclesModule],
})
export class ParkEntriesModule {}
