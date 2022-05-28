import { forwardRef, Module } from '@nestjs/common'
import { VehiclesController } from './vehicles.controller'
import { VehiclesService } from '../users/services/vehicles.service'
import { VehiclesResolver } from '../users/resolvers/vehicles.resolver'
import { UsersModule } from 'src/users/users.module'

@Module({
  controllers: [VehiclesController],
  providers: [],
  exports: [VehiclesService],
  imports: [],
})
export class VehiclesModule {}
