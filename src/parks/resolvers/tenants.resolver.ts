import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { ParkDto } from '../dto/park.dto'
import { TenantUserBindingDto } from '../dto/tenant-user.dto'
import {
  TenantCreateDto,
  TenantDetailDto,
  TenantDto,
  TenantListDto,
} from '../dto/tenant.dto'
import { ParksService } from '../services/parks.service'
import { TenantUserBindingsService } from '../services/tenant-user-bindings.service'
import { TenantsService } from '../services/tenants.service'

@Resolver(() => TenantDto)
export class TenantsResolver {
  constructor(
    private tenantsService: TenantsService,
    private parksService: ParksService,
    private tenantUserBindingsService: TenantUserBindingsService,
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

  @ResolveField(() => [TenantUserBindingDto])
  async tenantUserBindings(@Parent() tenant: TenantDto) {
    return await this.tenantUserBindingsService.list({ tenantId: tenant.id })
  }
}
