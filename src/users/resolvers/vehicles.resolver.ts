import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { ParkEntryDto } from 'src/parks/dto/park-entry.dto'
import { ParkEntriesService } from 'src/parks/services/park-entries.service'
import { UserDto } from 'src/users/dto/user.dto'
import { UsersService } from 'src/users/services/users.service'
import {
  VehicleCreateDto,
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

  @Query(() => [VehicleDto])
  async vehicles(@Args('VehicleListDto') data: VehicleListDto) {
    return await this.vehiclesService.list(data)
  }

  @ResolveField(() => UserDto)
  user(@Parent() vehicle: VehicleDto) {
    return this.usersService.getById(vehicle.userId)
  }

  @ResolveField(() => [ParkEntryDto])
  async parkEntries(@Parent() vehicle: VehicleDto) {
    return this.parkEntriesService.list({ vehicleId: vehicle.id })
  }
}
