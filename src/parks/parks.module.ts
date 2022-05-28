import { forwardRef, Module } from '@nestjs/common'
import { ParksService } from './services/parks.service'
import { ParksController } from './parks.controller'
import { ParksResolver } from './resolvers/parks.resolver'
import { ParkEntriesService } from './services/park-entries.service'
import { ParkEntriesResolver } from './resolvers/park-entries.resolver'
import { UsersModule } from 'src/users/users.module'

@Module({
  providers: [
    ParksService,
    ParksResolver,
    ParkEntriesService,
    ParkEntriesResolver,
  ],
  exports: [ParksService, ParkEntriesService],
  controllers: [ParksController],
  imports: [forwardRef(() => UsersModule)],
})
export class ParksModule {}
