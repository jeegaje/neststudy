import { Type } from "class-transformer"
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "src/core/dto/pagination.dto"
import { StatusRental } from "../enum/status-rental.enum"

export class FilterRentalDto extends PaginationDto {
    @IsInt()
    @Type(()=>Number)
    @IsOptional()
    car_id?: number  

    @IsInt()
    @IsOptional()
    @Type(()=>Number)
    city_id?: number

    @IsString()
    @IsOptional()
    @IsEnum(StatusRental)
    status?: string
}