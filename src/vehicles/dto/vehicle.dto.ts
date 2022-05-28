import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsIn, IsNumberString, Length } from 'class-validator'
import { UserDto } from 'src/users/dto/user.dto'
import { validLetters, validRegionNames } from './constants'

@ObjectType()
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

  @Field((type) => UserDto)
  user: UserDto

  @Field()
  createdAt: Date
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
  @Field()
  @IsEmail()
  userId: string
}
