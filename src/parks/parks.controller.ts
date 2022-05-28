import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ParkCreateDto, ParkListDto } from './dto/park.dto'
import { ParksService } from './services/parks.service'

@Controller('parks')
export class ParksController {
  constructor(private parksService: ParksService) {}

  @Post('create')
  async create(@Body() data: ParkCreateDto) {
    return await this.parksService.create(data)
  }

  @Get('list')
  async list(@Query() data: ParkListDto) {
    return await this.parksService.list(data)
  }
}
