import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator"
import { CarStatus } from "../enum/car-status.enum"

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
    @Type(()=>Number)
    price: number

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(CarStatus)
    status: string
    
}
