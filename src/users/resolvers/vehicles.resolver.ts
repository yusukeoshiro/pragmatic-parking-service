import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { DeletedRecordDto } from 'src/common.dto'
import { ParkEntryDto, ParkEntryListDto } from 'src/parks/dto/park-entry.dto'
import { ParkEntriesService } from 'src/parks/services/park-entries.service'
import { UserDto } from 'src/users/dto/user.dto'
import { UsersService } from 'src/users/services/users.service'
import {
  VehicleCreateDto,
  VehicleDeleteDto,
  VehicleDetailDto,
  VehicleDto,
  VehicleListDto,
} from '../dto/vehicle.dto'
import { VehiclesService } from '../services/vehicles.service'

@Resolver(() => VehicleDto)
export class VehiclesResolver {
  constructor(
    private vehiclesService: VehiclesService,
    private usersService: UsersService,
    private parkEntriesService: ParkEntriesService,
  ) {}

  @Mutation(() => VehicleDto)
  async createVehicle(@Args('vehicleCreateDto') data: VehicleCreateDto) {
    await this.usersService.getById(data.userId) // user must exist
    return this.vehiclesService.create(data)
  }

  @Mutation(() => DeletedRecordDto)
  async deleteVehicle(
    @Args('vehicleDeleteDto') data: VehicleDeleteDto,
  ): Promise<DeletedRecordDto> {
    await this.vehiclesService.deleteById(data.id)
    return data
  }

  @Query(() => VehicleDto)
  async vehicle(@Args('vehicleDetailDto') data: VehicleDetailDto) {
    return await this.vehiclesService.getById(data.id)
  }

  @Query(() => [VehicleDto])
  async vehicles(
    @Args('VehicleListDto', { nullable: true }) data?: VehicleListDto,
  ) {
    return await this.vehiclesService.list(data)
  }

  @ResolveField(() => UserDto)
  user(@Parent() vehicle: VehicleDto) {
    return this.usersService.getById(vehicle.userId)
  }

  @ResolveField(() => [ParkEntryDto])
  async parkEntries(
    @Parent() vehicle: VehicleDto,
    @Args('parkEntryListDto', { nullable: true }) data: ParkEntryListDto,
  ) {
    return this.parkEntriesService.list({ ...data, vehicleId: vehicle.id })
  }
}
