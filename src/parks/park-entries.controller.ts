import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { VehiclesService } from 'src/users/services/vehicles.service'
import {
  ParkEntryAnonymousCreateDto,
  ParkEntryCreateDto,
} from './dto/park-entry.dto'
import { ParkCreateDto, ParkListDto } from './dto/park.dto'
import { ParkEntriesService } from './services/park-entries.service'
import { ParksService } from './services/parks.service'

@Controller('park-entries')
export class ParkEntriesController {
  constructor(
    private parksService: ParksService,
    private vehiclesService: VehiclesService,
    private parkEntriesService: ParkEntriesService,
  ) {}

  @Post('create')
  async create(@Body() data: ParkCreateDto) {
    return await this.parksService.create(data)
  }

  @Get('list')
  async list(@Query() data: ParkListDto) {
    return await this.parksService.list(data)
  }

  @Post('create-from-box')
  async createFromBox(@Body() data: ParkEntryAnonymousCreateDto) {
    let vehicle = await this.vehiclesService.query(data)
    if (!vehicle) {
      vehicle = await this.vehiclesService.createAnonymous(data)
    }

    const parkEntriesCreateDto: ParkEntryCreateDto = {
      ...data,
      vehicleId: vehicle.id,
      userId: vehicle.userId,
      parkId: data.parkId,
    }

    return await this.parkEntriesService.create(parkEntriesCreateDto)
  }
}
