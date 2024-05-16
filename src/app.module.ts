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
import { MailModule } from './module/mail/mail.module';
import { PaymentModule } from './module/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CitiesModule,
    UsersModule,
    AuthModule,
    CarsModule,
    RentalsModule,
    MailModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
