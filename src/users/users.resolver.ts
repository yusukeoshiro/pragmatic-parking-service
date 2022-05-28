import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { VehicleDto } from 'src/vehicles/dto/vehicle.dto'
import { VehiclesService } from 'src/vehicles/vehicles.service'
import { UserCreateDto, UserDto } from './dto/user.dto'
import { UsersService } from './users.service'

@Resolver(() => UserDto)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private vehiclesService: VehiclesService,
  ) {}

  @Mutation(() => UserDto)
  createUser(@Args('userCreateDto') userCreateDto: UserCreateDto) {
    return this.usersService.create(userCreateDto)
  }

  @Query(() => [UserDto])
  async users(): Promise<UserDto[]> {
    return this.usersService.list()
  }

  @ResolveField()
  displayName(@Parent() user: UserDto) {
    return `${user.lastName} ${user.firstName}`
  }

  @ResolveField(() => [VehicleDto])
  async vehicles(@Parent() user: UserDto) {
    return this.vehiclesService.list({ userId: user.id })
  }
}
