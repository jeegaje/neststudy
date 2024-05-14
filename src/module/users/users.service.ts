import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../core/services/prisma.service';

import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        const hashedPass = await bcrypt.hash(createUserDto.password, 10)
        createUserDto.password = hashedPass
        const user = this.prisma.user.create({
            data: {
                username: createUserDto.username,
                password: hashedPass,
                role: createUserDto.role
            }
        })

        return user
    }

    async getUser(username: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (!user) {
            return null
        }
        return user
    }
}
