import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UserDto } from 'src/users/dto/user.dto'
import { UsersService } from 'src/users/services/users.service'
import {
  TenantUserBindingCreateDto,
  TenantUserBindingDto,
  TenantUserBindingListDto,
} from '../dto/tenant-user.dto'
import { TenantDto } from '../dto/tenant.dto'
import { TenantUserBindingsService } from '../services/tenant-user-bindings.service'
import { TenantsService } from '../services/tenants.service'

@Resolver(() => TenantUserBindingDto)
export class TenantUserBindingsResolver {
  constructor(
    private tenantUserBindingsService: TenantUserBindingsService,
    private usersService: UsersService,
    private tenantsService: TenantsService,
  ) {}

  @Mutation(() => TenantUserBindingDto)
  async createTenantUserBinding(
    @Args('tenantUserBindingCreateDto') data: TenantUserBindingCreateDto,
  ) {
    await this.tenantsService.getById(data.tenantId)
    await this.usersService.getById(data.userId)
    return this.tenantUserBindingsService.create(data)
  }

  @Query(() => [TenantUserBindingDto])
  async tenantUserBindings(
    @Args('tenantUserBindingListDto', { nullable: true })
    data: TenantUserBindingListDto,
  ) {
    return await this.tenantUserBindingsService.list(data)
  }

  @ResolveField(() => UserDto)
  async user(@Parent() data: TenantUserBindingDto) {
    return await this.usersService.getById(data.userId)
  }

  @ResolveField(() => TenantDto)
  async tenant(@Parent() data: TenantUserBindingDto) {
    return await this.tenantsService.getById(data.tenantId)
  }
}
