import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { PrismaService } from 'src/core/services/prisma.service';
import { MidtransService } from 'src/core/services/midtrans.service';

@Module({
  controllers: [RentalsController],
  providers: [RentalsService, PrismaService, MidtransService],
})
export class RentalsModule {}
