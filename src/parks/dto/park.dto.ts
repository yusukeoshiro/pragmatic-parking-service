import { Field, Float, ID, InputType, ObjectType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from 'class-validator'
import { ParkEntryDto } from './park-entry.dto'
import { TenantDto } from './tenant.dto'

@ObjectType()
export class ParkDto {
  @Field(() => ID)
  id: string

  @Field()
  @IsString()
  @Length(5, 50)
  name: string

  @Field()
  @IsString()
  @Length(10, 50)
  address: string

  @Field()
  @IsPositive()
  @IsNumber()
  capacity: number

  @Field()
  @IsLatitude()
  latitude: number

  @Field()
  @IsLongitude()
  longitude: number

  @Field()
  geoHash: string

  @Field()
  createdAt: Date

  @Field({ nullable: true })
  entranceImageUrl: string

  @Field({ nullable: true })
  exitImageUrl: string

  @Field(() => Float, { nullable: true })
  distance: number

  @Field(() => [ParkEntryDto])
  parkEntries: ParkEntryDto[]

  @Field(() => [TenantDto])
  tenants: TenantDto[]
}

@InputType()
export class ParkCreateDto {
  @Field()
  @IsString()
  @Length(5, 50)
  name: string

  @Field()
  @IsString()
  @Length(10, 50)
  address: string

  @Field()
  @IsPositive()
  @IsNumber()
  capacity: number

  @Field()
  @IsLatitude()
  latitude: number

  @Field()
  @IsLongitude()
  longitude: number

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  entranceImageUrl: string

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  exitImageUrl: string
}

@InputType()
export class ParkUpdateDto {
  @Field()
  @IsString()
  id: string

  @Field({ nullable: true })
  @IsString()
  @Length(5, 50)
  @IsOptional()
  name?: string

  @Field({ nullable: true })
  @IsString()
  @Length(10, 50)
  @IsOptional()
  address?: string

  @Field({ nullable: true })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  capacity?: number

  @Field({ nullable: true })
  @IsLatitude()
  @IsOptional()
  latitude?: number

  @Field({ nullable: true })
  @IsLongitude()
  @IsOptional()
  longitude?: number

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  entranceImageUrl?: string

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  exitImageUrl?: string
}

@InputType()
export class LatLngInput {
  @Field()
  latitude: number
  @Field()
  longitude: number
}

@InputType()
export class ParkListDto {
  @Field({ nullable: true })
  @IsOptional()
  center?: LatLngInput

  @Field({ nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  distance?: number
}

@InputType()
export class ParkDetailDto {
  @Field()
  @IsString()
  id: string
}
