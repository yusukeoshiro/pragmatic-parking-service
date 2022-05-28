import { IsEmail, IsIn, IsNumber, IsNumberString, Length } from 'class-validator'
import { validLetters, validRegionNames } from './constants'

export class VehicleDto {
  id: string

  @Length(1, 30)
  name: string

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

  @IsEmail()
  userId: string

  createdAt: Date
}

export class VehicleCreateDto {
  @Length(1, 30)
  name: string

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

  @IsEmail()
  userId: string
}

export class VehicleListDto {
  @IsEmail()
  userId: string
}
