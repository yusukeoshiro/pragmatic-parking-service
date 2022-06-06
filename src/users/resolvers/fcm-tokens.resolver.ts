import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { FcmTokenCreateDto, FcmTokenDto } from '../dto/fcm-token.dto'
import { FcmTokensService } from '../services/fcm-tokens.service'
import { UsersService } from '../services/users.service'

@Resolver(() => FcmTokenDto)
export class FcmTokensResolver {
  constructor(
    private fcmTokensService: FcmTokensService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => FcmTokenDto)
  async createFcmToken(@Args('fcmTokenCreateDto') data: FcmTokenCreateDto) {
    await this.usersService.getById(data.userId)
    return await this.fcmTokensService.create(data)
  }
}
