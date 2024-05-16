import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../core/services/prisma.service';
import {v4 as uuidv4} from 'uuid';
import * as bcrypt from 'bcrypt'
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        const hashedPass = await bcrypt.hash(createUserDto.password, 10)
        const activationToken = uuidv4();

        createUserDto.password = hashedPass
        const user = await this.prisma.user.create({
            data: {
                username: createUserDto.username,
                password: hashedPass,
                role: createUserDto.role,
                activationToken: activationToken
            }
        })

        await this.mailService.sendUserConfirmation(activationToken)


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
