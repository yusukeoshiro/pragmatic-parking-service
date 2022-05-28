import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import {
  ParkEntryCreateDto,
  ParkEntryExitDto,
  ParkEntryListDto,
} from './dto/park-entry.dto'
import { ParkEntriesService } from './park-entries.service'

@Controller('park-entries')
export class ParkEntriesController {
  constructor(private parkEntriesService: ParkEntriesService) {}

  @Post('create')
  async create(@Body() data: ParkEntryCreateDto) {
    return this.parkEntriesService.create(data)
  }

  @Post('exit')
  async exit(@Body() data: ParkEntryExitDto) {
    return this.parkEntriesService.exit(data)
  }

  @Get('list')
  async list(@Query() data: ParkEntryListDto) {
    return this.parkEntriesService.list(data)
  }
}
