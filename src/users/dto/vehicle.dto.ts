import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'
import { ParkEntryDto } from 'src/parks/dto/park-entry.dto'
import { UserDto } from 'src/users/dto/user.dto'
import { validLetters, validRegionNames } from './constants'

@ObjectType('Vehicle')
export class VehicleDto {
  @Field(() => ID)
  id: string

  @Field()
  @Length(1, 30)
  name: string

  @Field()
  @IsNumberString()
  @Length(1, 4)
  number: string

  @Field()
  @IsIn(validLetters)
  letter: string

  @Field()
  @Length(2, 3)
  @IsNumberString()
  classNumber: string

  @Field()
  @IsIn(validRegionNames)
  regionName: string

  @IsEmail()
  userId: string

  @Field(() => UserDto)
  user: UserDto

  @Field()
  createdAt: Date

  @Field(() => [ParkEntryDto])
  parkEntries: ParkEntryDto[]
}

@InputType()
export class VehicleCreateDto {
  @Field()
  @Length(1, 30)
  name: string

  @Field()
  @IsNumberString()
  @Length(1, 4)
  number: string

  @Field()
  @IsIn(validLetters)
  letter: string

  @Field()
  @Length(2, 3)
  @IsNumberString()
  classNumber: string

  @Field()
  @IsIn(validRegionNames)
  regionName: string

  @Field()
  @IsEmail()
  userId: string
}

@InputType()
export class VehicleListDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  userId: string
}

@InputType()
export class VehicleDetailDto {
  @Field()
  @IsString()
  id: string
}

@InputType()
export class VehicleQueryDto {
  @Field()
  @IsNumberString()
  @Length(1, 4)
  number: string

  @Field()
  @IsIn(validLetters)
  letter: string

  @Field()
  @Length(2, 3)
  @IsNumberString()
  classNumber: string

  @Field()
  @IsIn(validRegionNames)
  regionName: string
}

export class VehicleFindByNumberDto {
  @IsNumberString()
  @Length(1, 4)
  number: string

  @IsIn(validLetters)
  letter: string

  @Length(2, 3)
  @IsNumberString()
  classNumber: string

  @IsIn(validRegionNames)
  regionName: string
}
