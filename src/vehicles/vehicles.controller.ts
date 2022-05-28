import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { VehicleCreateDto, VehicleListDto } from './dto/vehicle.dto'
import { VehiclesService } from './vehicles.service'

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post('create')
  async create(@Body() data: VehicleCreateDto) {
    return await this.vehiclesService.create(data)
  }

  @Get('list')
  async list(@Query() data: VehicleListDto) {
    return await this.vehiclesService.list(data)
  }
}
