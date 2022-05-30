import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { UserDto } from 'src/users/dto/user.dto'
import { TenantDto } from './tenant.dto'

@ObjectType()
export class TenantUserBindingDto {
  @Field(() => ID)
  id: string

  @Field()
  @IsEmail()
  userId: string

  @Field()
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @Field(() => UserDto)
  user: UserDto

  @Field(() => TenantDto)
  tenant: TenantDto
}

@InputType()
export class TenantUserBindingCreateDto {
  @Field()
  @IsEmail()
  userId: string

  @Field()
  @IsNotEmpty()
  @IsString()
  tenantId: string
}

@InputType()
export class TenantUserBindingDeleteDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string
}

@InputType()
export class TenantUserBindingListDto {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  userId?: string

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tenantId?: string
}
