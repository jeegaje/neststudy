import { IsEnum, IsInt, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "src/core/dto/pagination.dto"
import { CarStatus } from "../enum/car-status.enum"
import { Type } from "class-transformer"

export class FilterCarDto extends PaginationDto {
    @IsString()
    @IsOptional()
    @IsEnum(CarStatus)
    status?: string

    @IsString()
    @IsOptional()
    color?: string

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    minPrice?: number

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    maxPrice?: number

    @IsString()
    @IsOptional()
    name?: string
}