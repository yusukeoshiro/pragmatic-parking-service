import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeletedRecordDto {
  @Field()
  public id: string
}
