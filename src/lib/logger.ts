import bynyan from 'bunyan'
import { LoggingBunyan } from '@google-cloud/logging-bunyan'

const loggingBunyan = new LoggingBunyan()

const serviceName =
  process.env.K_REVISION ||
  process.env.FUNCTION_NAME ||
  process.env.SERVICE_NAME ||
  'local-machine'

export const logger = bynyan.createLogger({
  name: serviceName,
  streams: [
    { stream: process.stdout, level: 'info' },
    loggingBunyan.stream('info'),
  ],
})

if (serviceName === 'local-machine') {
  const message = `either K_REVISION, FUNCTION_NAME, nor SERVICE_NAME was not set in the environment variable so ${serviceName} is used`
  logger.warn(message)
}
