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
import { Storage } from '@google-cloud/storage'
import { ConfigService } from '@nestjs/config'
import { ValidationDto } from '../dto/validation.dto'
import { ValidationsService } from '../services/validations.service'

const storage = new Storage()

@Resolver(() => ParkEntryDto)
export class ParkEntriesResolver {
  private imagesBucket: string
  constructor(
    private parkEntriesService: ParkEntriesService,
    private usersService: UsersService,
    private vehiclesService: VehiclesService,
    private parksService: ParksService,
    private validationsService: ValidationsService,
    private cs: ConfigService,
  ) {
    this.imagesBucket = this.cs.get('imagesBucket')
  }

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

  @ResolveField()
  async imageUrl(@Parent() parkEntry: ParkEntryDto): Promise<string> {
    const [url] = await storage
      .bucket(this.imagesBucket)
      .file(`${parkEntry.id}.jpg`)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 120 * 60 * 1000, // 120 minutes
      })

    return url
  }

  @ResolveField(() => [ValidationDto])
  async validations(@Parent() parkEntry: ParkEntryDto) {
    return await this.validationsService.list({ parkEntryId: parkEntry.id })
  }

  @ResolveField()
  async validationValueSum(@Parent() parkEntry: ParkEntryDto) {
    const validations = await this.validationsService.list({
      parkEntryId: parkEntry.id,
    })

    return validations.reduce((prev, current) => {
      return prev + current.value
    }, 0)
  }
}
