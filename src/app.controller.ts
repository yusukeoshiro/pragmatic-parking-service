import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { I18n, I18nContext } from 'nestjs-i18n'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public async root() {
    return await this.appService.getHello()
  }

  @Get('/hello')
  public async getHello(@I18n() i18n: I18nContext) {
    return await i18n.translate('main.HELLO_MESSAGE_WITH_NAME', {
      args: {
        name: 'some guy',
      },
    })
    return await this.appService.getHello()
  }
}
