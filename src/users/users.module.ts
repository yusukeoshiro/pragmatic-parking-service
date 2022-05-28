import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UsersResolver } from './users.resolver'
import { VehiclesModule } from 'src/vehicles/vehicles.module'

@Module({
  imports: [VehiclesModule],
  exports: [UsersService],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController],
})
export class UsersModule {}
