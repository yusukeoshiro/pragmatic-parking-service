import { forwardRef, Module } from '@nestjs/common'
import { VehiclesController } from './vehicles.controller'
import { VehiclesService } from './vehicles.service'
import { VehiclesResolver } from './vehicles.resolver'
import { UsersModule } from 'src/users/users.module'

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, VehiclesResolver],
  exports: [VehiclesService],
  imports: [forwardRef(() => UsersModule)],
})
export class VehiclesModule {}
