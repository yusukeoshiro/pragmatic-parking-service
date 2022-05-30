import { BadRequestException } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { ParkEntryDto } from '../dto/park-entry.dto'
import { TenantDto } from '../dto/tenant.dto'
import {
  ValidationCreateDto,
  ValidationDto,
  ValidationListDto,
} from '../dto/validation.dto'
import { ParkEntriesService } from '../services/park-entries.service'
import { TenantsService } from '../services/tenants.service'
import { ValidationsService } from '../services/validations.service'

@Resolver(() => ValidationDto)
export class ValidationsResolver {
  constructor(
    private validationsService: ValidationsService,
    private parkEntriesService: ParkEntriesService,
    private tenantService: TenantsService,
  ) {}

  @Mutation(() => ValidationDto)
  async createValidation(
    @Args('validationCreateDto') data: ValidationCreateDto,
  ) {
    const tenant = await this.tenantService.getById(data.tenantId)
    const parkEntry = await this.parkEntriesService.getById(data.parkEntryId)

    if (tenant.parkId !== parkEntry.parkId) {
      throw new BadRequestException(
        `the tenant and the park entry do not belong to the same park`,
      )
    }
    return await this.validationsService.create(data)
  }

  @Query(() => [ValidationDto])
  async validations(
    @Args('validationListDto', { nullable: true }) data?: ValidationListDto,
  ) {
    return await this.validationsService.list(data)
  }

  @ResolveField(() => ParkEntryDto)
  async parkEntry(@Parent() data: ValidationDto) {
    return await this.parkEntriesService.getById(data.parkEntryId)
  }

  @ResolveField(() => TenantDto)
  async tenant(@Parent() data: ValidationDto) {
    return await this.tenantService.getById(data.tenantId)
  }
}
