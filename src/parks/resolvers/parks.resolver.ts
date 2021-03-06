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
import { ParkEntryDto, ParkEntryListDto } from 'src/parks/dto/park-entry.dto'
import {
  ParkCreateDto,
  ParkDetailDto,
  ParkDto,
  ParkListDto,
  ParkUpdateDto,
} from '../dto/park.dto'
import { ParksService } from '../services/parks.service'
import { ParkEntriesService } from '../services/park-entries.service'
import { TenantDto } from '../dto/tenant.dto'
import { TenantsService } from '../services/tenants.service'

@Resolver(() => ParkDto)
export class ParksResolver {
  constructor(
    private parksService: ParksService,
    private parkEntriesService: ParkEntriesService,
    private tenantsService: TenantsService,
  ) {}

  @Mutation(() => ParkDto)
  async createPark(@Args('parkCreateDto') data: ParkCreateDto) {
    return this.parksService.create(data)
  }

  @Mutation(() => ParkDto)
  async updatePark(@Args('parkUpdateDto') data: ParkUpdateDto) {
    return this.parksService.update(data)
  }

  @Query(() => ParkDto)
  async park(@Args('parkDetailDto') data: ParkDetailDto) {
    return await this.parksService.getById(data.id)
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
  async parkEntries(
    @Parent() park: ParkDto,
    @Args('parkEntryListDto', { nullable: true }) data: ParkEntryListDto,
  ) {
    return await this.parkEntriesService.list({ ...data, parkId: park.id })
  }

  @ResolveField(() => [TenantDto])
  async tenants(@Parent() park: ParkDto) {
    return await this.tenantsService.list({ parkId: park.id })
  }
}
