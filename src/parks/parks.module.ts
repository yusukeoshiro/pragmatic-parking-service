import { Module } from '@nestjs/common'
import { ParksService } from './parks.service'
import { ParksController } from './parks.controller'
import { ParksResolver } from './parks.resolver'

@Module({
  providers: [ParksService, ParksResolver],
  exports: [ParksService],
  controllers: [ParksController],
})
export class ParksModule {}
