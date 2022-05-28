import { forwardRef, Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UsersResolver } from './users.resolver'
import { ParksModule } from 'src/parks/parks.module'
import { VehiclesResolver } from './resolvers/vehicles.resolver'
import { VehiclesService } from './services/vehicles.service'

@Module({
  imports: [forwardRef(() => ParksModule)],
  exports: [UsersService, VehiclesService],
  providers: [UsersService, UsersResolver, VehiclesResolver, VehiclesService],
  controllers: [UsersController],
})
export class UsersModule {}
