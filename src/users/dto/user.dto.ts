import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsString } from 'class-validator'
import { ParkEntryDto } from 'src/parks/dto/park-entry.dto'
import { VehicleDto } from './vehicle.dto'

@ObjectType('User')
export class UserDto {
  @Field(() => ID)
  @IsEmail()
  id: string

  @Field({ nullable: true })
  @IsString()
  firstName: string

  @Field({ nullable: true })
  @IsString()
  lastName: string

  @Field()
  createdAt: Date

  @Field(() => [VehicleDto])
  vehicles: VehicleDto[]

  @Field()
  displayName: string

  @Field(() => [ParkEntryDto])
  parkEntries: ParkEntryDto[]
}

@InputType()
export class UserCreateDto {
  @Field()
  @IsEmail()
  id: string

  @Field()
  @IsString()
  firstName: string

  @Field()
  @IsString()
  lastName: string
}

@InputType()
export class UserDetailDto {
  @Field()
  @IsEmail()
  id: string
}
