import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { logger } from '@metroly/orbit-error'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>('port')

  await app.listen(port, () => logger.info(`listening at port ${port}`))
}
bootstrap()
