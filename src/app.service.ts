import { Injectable } from '@nestjs/common'
import { I18nRequestScopeService } from 'nestjs-i18n'

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nRequestScopeService) {}

  public async getHello() {
    return await this.i18n.translate('main.HELLO_MESSAGE')
  }
}
