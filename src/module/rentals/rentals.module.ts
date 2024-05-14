import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { PrismaService } from 'src/core/services/prisma.service';

@Module({
  controllers: [RentalsController],
  providers: [RentalsService, PrismaService],
})
export class RentalsModule {}
