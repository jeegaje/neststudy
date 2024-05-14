import { IsNotEmpty, Matches, MinLength } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @Matches('^(?=.*[A-Z])(?=.*[!@#$%^&*()-+=]).+')
    password: string

    @IsNotEmpty()
    role: string
}