import { IsDateString, IsNotEmpty } from "class-validator"

export class CreateRentalDto {
    @IsNotEmpty()
    car_id: number

    @IsNotEmpty()
    user_id: number

    @IsNotEmpty()
    @IsDateString()
    rent_date: string

    @IsNotEmpty()
    @IsDateString()
    return_date: string

    @IsNotEmpty()
    status: string

    @IsNotEmpty()
    rent_cost: number

    @IsNotEmpty()
    city_id: number
    
}
