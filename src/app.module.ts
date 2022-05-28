import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n'
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ParksModule } from './parks/parks.module';
import { ParkEntriesModule } from './park-entries/park-entries.module';
import * as path from 'path'

@Module({
  imports: [
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
    VehiclesModule,
    ParksModule,
    ParkEntriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
