import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/module/users/users.module';
import { AuthService } from './auth.service';
import { UsersService } from 'src/module/users/users.service';
import { LocalStrategy } from './local.auth';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../core/guards/jwt-auth/jwt.strategy';
import { PrismaService } from 'src/core/services/prisma.service';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [UsersModule, PassportModule, MailModule, JwtModule.register({
        secret: 'secret',
        signOptions: { expiresIn: '360s' }
    })],
    providers: [AuthService, UsersService, LocalStrategy, JwtStrategy, PrismaService],
    controllers: [AuthController],
    exports: []
})
export class AuthModule {}
