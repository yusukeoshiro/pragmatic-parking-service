import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UserCreateDto, UserDetailDto } from './dto/user.dto'
import { UsersService } from './services/users.service'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/create')
  public async createUser(@Body() data: UserCreateDto) {
    return await this.usersService.create(data)
  }

  @Get('/detail')
  public async getUser(@Query() data: UserDetailDto) {
    return await this.usersService.getById(data.id)
  }
}
