import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateCarDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    color: string

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    price: number

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    status: string
    
}
