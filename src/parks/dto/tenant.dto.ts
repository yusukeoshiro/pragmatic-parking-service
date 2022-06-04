import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ParkDto } from './park.dto'
import { TenantUserBindingDto } from './tenant-user.dto'
import { ValidationDto } from './validation.dto'

@ObjectType()
export class TenantDto {
  @Field(() => ID)
  id: string
  @Field()
  name: string
  @Field()
  parkId: string
  @Field()
  createdAt: Date

  @Field(() => ParkDto)
  park: ParkDto

  @Field(() => [TenantUserBindingDto])
  tenantUserBindings: TenantUserBindingDto[]

  @Field(() => [ValidationDto])
  validations: ValidationDto[]
}

@InputType()
export class TenantCreateDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string

  @Field()
  @IsString()
  @IsNotEmpty()
  parkId: string
}

@InputType()
export class TenantDetailDto {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string
}

@InputType()
export class TenantListDto {
  @Field()
  @IsString()
  @IsOptional()
  parkId: string
}
