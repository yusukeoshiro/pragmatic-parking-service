import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UserDto } from 'src/users/dto/user.dto'
import { UsersService } from 'src/users/users.service'
import { VehicleCreateDto, VehicleDto, VehicleListDto } from './dto/vehicle.dto'
import { VehiclesService } from './vehicles.service'

@Resolver(() => VehicleDto)
export class VehiclesResolver {
  constructor(
    private vehiclesService: VehiclesService,
    private usersService: UsersService,
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
}
