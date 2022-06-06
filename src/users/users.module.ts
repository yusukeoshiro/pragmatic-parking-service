import { forwardRef, Module } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { UsersController } from './users.controller'
import { UsersResolver } from './resolvers/users.resolver'
import { ParksModule } from 'src/parks/parks.module'
import { VehiclesResolver } from './resolvers/vehicles.resolver'
import { VehiclesService } from './services/vehicles.service'
import { FcmTokensService } from './services/fcm-tokens.service'
import { FcmTokensResolver } from './resolvers/fcm-tokens.resolver'

@Module({
  imports: [forwardRef(() => ParksModule)],
  exports: [UsersService, VehiclesService],
  providers: [
    UsersService,
    UsersResolver,
    VehiclesResolver,
    VehiclesService,
    FcmTokensResolver,
    FcmTokensService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
