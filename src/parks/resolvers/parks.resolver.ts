import {
  Args,
  Float,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { distanceBetween } from 'geofire-common'
import { ParkEntryDto } from 'src/parks/dto/park-entry.dto'
import { ParkCreateDto, ParkDto, ParkListDto } from '../dto/park.dto'
import { ParksService } from '../services/parks.service'
import { ParkEntriesService } from '../services/park-entries.service'

@Resolver(() => ParkDto)
export class ParksResolver {
  constructor(
    private parksService: ParksService,
    private parkEntriesService: ParkEntriesService,
  ) {}

  @Mutation(() => ParkDto)
  async createPark(@Args('parkCreateDto') data: ParkCreateDto) {
    return this.parksService.create(data)
  }

  @Query(() => [ParkDto])
  async parks(@Args('parkListDto', { nullable: true }) data?: ParkListDto) {
    return await this.parksService.list(data)
  }

  @ResolveField(() => Float)
  distance(@Parent() park: ParkDto, @Args('parkListDto') data?: ParkListDto) {
    if (!data || Object.keys(data).length === 0) {
      return null
    }
    return distanceBetween(
      [data.center.latitude, data.center.longitude],
      [park.latitude, park.longitude],
    )
  }

  @ResolveField(() => [ParkEntryDto])
  async parkEntries(@Parent() park: ParkDto) {
    return await this.parkEntriesService.list({ parkId: park.id })
  }
}