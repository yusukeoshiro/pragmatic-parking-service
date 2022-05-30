import { forwardRef, Module } from '@nestjs/common'
import { ParksService } from './services/parks.service'
import { ParksController } from './parks.controller'
import { ParksResolver } from './resolvers/parks.resolver'
import { ParkEntriesService } from './services/park-entries.service'
import { ParkEntriesResolver } from './resolvers/park-entries.resolver'
import { UsersModule } from 'src/users/users.module'
import { ParkEntriesController } from './park-entries.controller'
import { TenantsService } from './services/tenants.service'
import { TenantsResolver } from './resolvers/tenants.resolver'

@Module({
  providers: [
    ParksService,
    ParksResolver,
    ParkEntriesService,
    ParkEntriesResolver,
    TenantsService,
    TenantsResolver,
  ],
  exports: [ParksService, ParkEntriesService],
  controllers: [ParksController, ParkEntriesController],
  imports: [forwardRef(() => UsersModule)],
})
export class ParksModule {}
