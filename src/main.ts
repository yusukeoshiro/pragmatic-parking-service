import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { logger } from './lib/logger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>('port')

  await app.listen(port, () => logger.info(`listening at port ${port}`))
}
bootstrap()
