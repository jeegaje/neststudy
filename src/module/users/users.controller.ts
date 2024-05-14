import { Controller, Body, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    async register(
        @Body() createUserDto: CreateUserDto
    ) {
        return this.usersService.createUser(createUserDto)
    }

}
