import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/services/prisma.service";
import { NotFoundError } from "rxjs";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService, 
        private jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.userService.getUser(username)

        if (!user) {
            return null
        }
        const passValid = await bcrypt.compare(password, user.password)
        if(passValid) {
            const { password, ...result } = user
            return result
        }
        return null;
    }

    async login(user: User) {
        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role,
            isActive: user.isActive
        }

        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async confirmationAccount(token: string) {
        
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    activationToken: token
                }
            })
    
            if (!user) {
                throw new NotFoundException
            }
            

            const update = await this.prisma.user.update({
                where: {
                    activationToken: token
                },
                data: {
                    isActive: true,                }
            })
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException
        }
    }
}