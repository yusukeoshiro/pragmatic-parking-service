import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator'
import { ParkEntryDto } from './park-entry.dto'
import { TenantDto } from './tenant.dto'

@ObjectType()
export class ValidationDto {
  @Field(() => ID)
  @IsString()
  id: string

  @Field()
  createdAt: Date

  @Field()
  @IsPositive()
  @IsNumber()
  value: number

  @Field()
  @IsString()
  @IsNotEmpty()
  tenantId: string

  @Field()
  @IsString()
  @IsNotEmpty()
  parkEntryId: string

  @Field(() => ParkEntryDto)
  parkEntry: ParkEntryDto

  @Field(() => TenantDto)
  tenant: TenantDto
}

@InputType()
export class ValidationCreateDto {
  @Field()
  @IsPositive()
  @IsNumber()
  value: number

  @Field()
  @IsString()
  @IsNotEmpty()
  tenantId: string

  @Field()
  @IsString()
  @IsNotEmpty()
  parkEntryId: string
}

@InputType()
export class ValidationListDto {
  @Field()
  @IsOptional()
  @IsString()
  tenantId?: string

  @Field()
  @IsOptional()
  @IsString()
  parkEntryId?: string
}
