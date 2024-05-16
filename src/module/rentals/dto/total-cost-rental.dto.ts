import { Type } from "class-transformer"
import { IsInt } from "class-validator"

export class TotalCostRentalDto {
    @IsInt()
    @Type(()=>Number)
    car_id: number

    @IsInt()
    @Type(()=>Number)
    city_id: number
}