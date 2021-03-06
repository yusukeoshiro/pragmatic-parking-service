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
  ParkEntryDeleteDto,
  ParkEntryDetailDto,
  ParkEntryDto,
  ParkEntryExitDto,
  ParkEntryImages,
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
import { DeletedRecordDto } from 'src/common.dto'

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

  @Mutation(() => DeletedRecordDto)
  async deleteParkEntry(@Args('parkEntryDeleteDto') data: ParkEntryDeleteDto) {
    return await this.parkEntriesService.delete(data)
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
  async images(@Parent() parkEntry: ParkEntryDto): Promise<ParkEntryImages> {
    const entranceFileName = `${parkEntry.id}-entrance.jpg`
    const exitFileName = `${parkEntry.id}-exit.jpg`

    const entranceImageUrl = !!parkEntry.entryTime
      ? await getSignedUrl(this.imagesBucket, entranceFileName)
      : null

    const exitImageUrl = !!parkEntry.exitTime
      ? await getSignedUrl(this.imagesBucket, exitFileName)
      : null

    return {
      entry: {
        imageUrl: entranceImageUrl,
      },
      exit: {
        imageUrl: exitImageUrl,
      },
    }
  }

  @Query(() => ParkEntryDto)
  async parkEntry(@Args('parkEntryDetailDto') data: ParkEntryDetailDto) {
    return await this.parkEntriesService.getById(data.id)
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

const getSignedUrl = async (
  bucket: string,
  fileName: string,
): Promise<string> => {
  const [exists] = await storage.bucket(bucket).file(fileName).exists()
  if (!exists) return null

  const [url] = await storage
    .bucket(bucket)
    .file(fileName)
    .getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 120 * 60 * 1000, // 120 minutes
    })
  return url
}
