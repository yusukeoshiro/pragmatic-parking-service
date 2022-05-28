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
import { VehiclesService } from 'src/users/services/vehicles.service'
import { UserCreateDto, UserDto } from './dto/user.dto'
import { VehicleDto } from './dto/vehicle.dto'
import { UsersService } from './users.service'

@Resolver(() => UserDto)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private vehiclesService: VehiclesService,
    private parkEntriesService: ParkEntriesService,
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

  @ResolveField(() => [ParkEntryDto])
  async parkEntries(@Parent() user: UserDto) {
    return this.parkEntriesService.list({ userId: user.id })
  }
}
