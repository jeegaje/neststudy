import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { join } from 'path';
import { CitiesModule } from './module/cities/cities.module';
import { UsersModule } from './module/users/users.module';
import { AuthModule } from './module/auth/auth.module';
import { CarsModule } from './module/cars/cars.module';
import { RentalsModule } from './module/rentals/rentals.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST'),
    //     port: configService.get('DB_PORT'),
    //     username: configService.get('DB_USERNAME'),
    //     password: configService.get('DB_PASSWORD'),
    //     database: configService.get('DB_NAME'),
    //     entities: [join(process.cwd(), 'dist/**/*.entity.js')],
    //     synchronize: true
    //   })
    // }),
    CitiesModule,
    UsersModule,
    AuthModule,
    CarsModule,
    RentalsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
