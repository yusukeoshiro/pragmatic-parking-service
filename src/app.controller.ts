import { Controller, Get, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { Response } from 'express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public async root(@Res() res: Response) {
    res.redirect('/graphql')
  }
}
