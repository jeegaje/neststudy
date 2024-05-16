import { Controller, Request, Post, UseGuards, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    login(@Request() req) {
        return this.authService.login(req.user)
    }

    @Get('/confirmation-account')
    confirmationAccount(
        @Query('token') token: string
    ) {
        return this.authService.confirmationAccount(token)
    }
}
