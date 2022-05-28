import { IsEmail, IsString } from 'class-validator'

export class UserDto {
  @IsEmail()
  id: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  createdAt: Date
}

export class UserCreateDto {
  @IsEmail()
  id: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string
}

export class UserGetDto {
  @IsEmail()
  id: string
}
