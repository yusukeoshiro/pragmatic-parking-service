import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import {
  ParkEntryCreateDto,
  ParkEntryDto,
  ParkEntryExitDto,
  ParkEntryListDto,
  ParkEntryStatus,
} from 'src/parks/dto/park-entry.dto'
import { ParksService } from 'src/parks/services/parks.service'
import { UsersService } from 'src/users/services/users.service'
import { VehiclesService } from 'src/users/services/vehicles.service'
import { ParkEntriesService } from '../services/park-entries.service'
import { VehicleDto } from 'src/users/dto/vehicle.dto'
import { BadRequestException } from '@nestjs/common'

@Resolver(() => ParkEntryDto)
export class ParkEntriesResolver {
  constructor(
    private parkEntriesService: ParkEntriesService,
    private usersService: UsersService,
    private vehiclesService: VehiclesService,
    private parksService: ParksService,
  ) {}

  @Query(() => [ParkEntryDto])
  async parkEntries(@Args('parkEntryListDto') data: ParkEntryListDto) {
    return await this.parkEntriesService.list(data)
  }

  @Mutation(() => ParkEntryDto)
  async exitParkingEntry(
    @Args('parkEntryExitDto') data: ParkEntryExitDto,
  ): Promise<ParkEntryDto> {
    return await this.parkEntriesService.exit(data)
  }

  @Mutation(() => ParkEntryDto)
  async createParkEntry(@Args('parkEntryCreateDto') data: ParkEntryCreateDto) {
    const vehicle = await this.vehiclesService.getById(data.vehicleId)
    if (data.userId !== vehicle.userId) {
      throw new BadRequestException(`invalid vehicle id and user id `)
    }
    await this.usersService.getById(data.userId)
    await this.parksService.getById(data.parkId)

    const entries = await this.parkEntriesService.list({
      vehicleId: data.vehicleId,
      status: ParkEntryStatus.IN_PARKING,
    })

    if (entries.length > 0) {
      throw new BadRequestException(`this vehicle is already parked here`)
    }

    return this.parkEntriesService.create(data)
  }

  @ResolveField()
  async user(@Parent() parkEntry: ParkEntryDto) {
    return await this.usersService.getById(parkEntry.userId)
  }

  @ResolveField()
  async park(@Parent() parkEntry: ParkEntryDto) {
    return await this.parksService.getById(parkEntry.parkId)
  }

  @ResolveField(() => VehicleDto)
  async vehicle(@Parent() parkEntry: ParkEntryDto): Promise<VehicleDto> {
    return await this.vehiclesService.getById(parkEntry.vehicleId)
  }
}
