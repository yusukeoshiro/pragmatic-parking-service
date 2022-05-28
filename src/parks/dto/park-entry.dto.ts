import {
  Field,
  GraphQLISODateTime,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { UserDto } from 'src/users/dto/user.dto'
import { VehicleDto } from 'src/users/dto/vehicle.dto'
import { ParkDto } from './park.dto'

export enum ParkEntryStatus {
  IN_PARKING = 'IN_PARKING',
  EXITED = 'EXITED',
}

registerEnumType(ParkEntryStatus, {
  name: 'ParkEntryStatus',
})

@ObjectType()
export class ParkEntryDto {
  @Field(() => ID)
  id: string

  @Field()
  vehicleId: string

  @Field()
  userId: string

  @Field()
  parkId: string

  @Field(() => ParkEntryStatus)
  status: ParkEntryStatus

  @Field()
  entryTime: Date

  @Field()
  exitTime?: Date

  @Field(() => ParkDto)
  park: ParkDto

  @Field(() => VehicleDto)
  vehicle: VehicleDto

  @Field(() => UserDto)
  user: UserDto
}

@InputType()
export class ParkEntryExitDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string
}

@InputType()
export class ParkEntryCreateDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  vehicleId: string

  @Field()
  @IsEmail()
  userId: string

  @Field()
  @IsString()
  @IsNotEmpty()
  parkId: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  entryTime?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  exitTime?: Date
}

@InputType()
export class ParkEntryListDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  vehicleId?: string

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  userId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  parkId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(ParkEntryStatus)
  status?: ParkEntryStatus
}