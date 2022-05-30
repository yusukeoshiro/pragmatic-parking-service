import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { ParkDto } from '../dto/park.dto'
import {
  TenantCreateDto,
  TenantDetailDto,
  TenantDto,
  TenantListDto,
} from '../dto/tenant.dto'
import { ParksService } from '../services/parks.service'
import { TenantsService } from '../services/tenants.service'

@Resolver(() => TenantDto)
export class TenantsResolver {
  constructor(
    private tenantsService: TenantsService,
    private parksService: ParksService,
  ) {}

  @Mutation(() => TenantDto)
  async createTenant(@Args('tenantCreateDto') data: TenantCreateDto) {
    await this.parksService.getById(data.parkId)
    return await this.tenantsService.create(data)
  }

  @Query(() => [TenantDto])
  async tenants(
    @Args('tenantListDto', { nullable: true }) data?: TenantListDto,
  ) {
    return await this.tenantsService.list(data)
  }

  @Query(() => TenantDto)
  async tenant(@Args('tenantDetailDto') data: TenantDetailDto) {
    return await this.tenantsService.getById(data.id)
  }

  @ResolveField(() => ParkDto)
  async park(@Parent() tenant: TenantDto) {
    return await this.parksService.getById(tenant.parkId)
  }
}
