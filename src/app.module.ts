import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n'
import { UsersModule } from './users/users.module'
import { ParksModule } from './parks/parks.module'
import * as path from 'path'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
      ],
    }),
    UsersModule,
    ParksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
