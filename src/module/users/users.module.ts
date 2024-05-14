import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/core/services/prisma.service';

@Module({
    imports: [],
    providers: [UsersService, PrismaService],
    controllers: [UsersController],
})
export class UsersModule {}
