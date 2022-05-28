import { Module } from '@nestjs/common';
import { ParksService } from './parks.service';
import { ParksController } from './parks.controller';

@Module({
  providers: [ParksService],
  controllers: [ParksController]
})
export class ParksModule {}
