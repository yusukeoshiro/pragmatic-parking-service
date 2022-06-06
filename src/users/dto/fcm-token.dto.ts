import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

@ObjectType('FcmToken')
export class FcmTokenDto {
  @Field(() => ID)
  id: string
  @Field()
  userId: string
  @Field()
  token: string
  @Field()
  createdAt: Date
  @Field()
  lastUsedAt: Date
}

@InputType()
export class FcmTokenCreateDto {
  @Field()
  @IsEmail()
  userId: string

  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(100, 500)
  token: string
}

@InputType()
export class FcmTokenListDto {
  @Field()
  @IsEmail()
  userId: string
}
