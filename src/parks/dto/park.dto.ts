import { Transform } from 'class-transformer'
import {
  IsLatitude,
  IsLatLong,
  IsLongitude,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator'

export class ParkDto {
  id: string

  @IsString()
  @Length(5, 50)
  name: string

  @IsString()
  @Length(10, 50)
  address: string

  @IsPositive()
  @IsNumber()
  capacity: number

  @IsLatitude()
  latitude: number

  @IsLongitude()
  longitude: number

  geoHash: string

  createdAt: Date
}

export class ParkCreateDto {
  @IsString()
  @Length(5, 50)
  name: string

  @IsString()
  @Length(10, 50)
  address: string

  @IsPositive()
  @IsNumber()
  capacity: number

  @IsLatitude()
  latitude: number

  @IsLongitude()
  longitude: number
}

export class ParkListDto {
  @IsLatLong()
  center: string

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  distance: number
}
