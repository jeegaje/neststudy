import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secret'
        })
    }

    async validate(payload: any) {
        if (!payload.isActive) {
            throw new UnauthorizedException('Please activate account')
        }
        return { id: payload.sub, username: payload.username, role: payload.role }
    }
}   