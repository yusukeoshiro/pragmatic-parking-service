import { Transform } from 'class-transformer'
import { IsEmail, IsOptional, IsString } from 'class-validator'
import moment from 'moment'

export enum ParkEntryStatus {
  IN_PARKING = 'IN_PARKING',
  EXITED = 'EXITED',
}

export class ParkEntryDto {
  id: string
  vehicleId: string
  userId: string
  parkId: string
  status: ParkEntryStatus
  entryTime: moment.Moment
  exitTime?: moment.Moment
}

export class ParkEntryExitDto {
  @IsString()
  id: string
}

export class ParkEntryCreateDto {
  @IsString()
  vehicleId: string

  @IsEmail()
  userId: string

  @IsString()
  parkId: string

  @IsOptional()
  @Transform(({ value }) => moment(value))
  entryTime?: moment.Moment

  @IsOptional()
  @Transform(({ value }) => moment(value))
  exitTime?: moment.Moment
}

export class ParkEntryListDto {
  @IsOptional()
  @IsString()
  vehicleId: string

  @IsEmail()
  @IsOptional()
  userId: string

  @IsOptional()
  @IsString()
  parkId: string
}
