import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService, private jwtService: JwtService) {}

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

    async login(user: any) {
        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role
        }

        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}