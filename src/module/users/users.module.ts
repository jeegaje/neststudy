import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/core/services/prisma.service';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [MailModule],
    providers: [UsersService, PrismaService],
    controllers: [UsersController],
})
export class UsersModule {}
