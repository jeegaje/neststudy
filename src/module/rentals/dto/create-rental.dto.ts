import { IsDateString, IsEnum, IsNotEmpty } from "class-validator"
import { StatusRental } from "../enum/status-rental.enum"

export class CreateRentalDto {
    @IsNotEmpty()
    car_id: number

    @IsNotEmpty()
    @IsDateString()
    rent_date: Date

    @IsNotEmpty()
    @IsDateString()
    return_date: Date

    @IsNotEmpty()
    @IsEnum(StatusRental)
    status: string

    @IsNotEmpty()
    rent_cost: number

    @IsNotEmpty()
    city_id: number
    
}
