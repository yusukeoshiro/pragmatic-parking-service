import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsString } from 'class-validator'
import { VehicleDto } from 'src/vehicles/dto/vehicle.dto'

@ObjectType()
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

export class UserGetDto {
  @IsEmail()
  id: string
}
