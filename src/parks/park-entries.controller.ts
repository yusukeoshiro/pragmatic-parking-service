import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common'
import { UsersService } from 'src/users/services/users.service'
import { VehiclesService } from 'src/users/services/vehicles.service'
import {
  ParkEntryAnonymousCreateDto,
  ParkEntryAnonymousExitDto,
  ParkEntryCreateDto,
  ParkEntryStatus,
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
    private usersService: UsersService,
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

    await this.usersService.getById(vehicle.userId)
    await this.parksService.getById(data.parkId)

    const entries = await this.parkEntriesService.list({
      vehicleId: vehicle.id,
      status: ParkEntryStatus.IN_PARKING,
    })

    if (entries.length > 0) {
      throw new BadRequestException(`this vehicle is already parked here`)
    }

    return await this.parkEntriesService.create(parkEntriesCreateDto)
  }

  @Post('exit-from-box')
  async exitFromBox(@Body() data: ParkEntryAnonymousExitDto) {
    const { image, ...findParam } = data
    const entry = await this.parkEntriesService.findFirst(findParam)
    if (!entry) throw new NotFoundException('vehicle not found at this parking')

    return this.parkEntriesService.exit({ image, id: entry.id })
  }
}
