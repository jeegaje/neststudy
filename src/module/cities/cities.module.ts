import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { PrismaService } from 'src/core/services/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CitiesController],
  providers: [CitiesService, PrismaService],
})
export class CitiesModule {}
