import { Car } from "@prisma/client"
import { CreateCarDto } from "../dto/create-car.dto"
import { ResultCreateCarDto } from "../dto/result-create-care.dto"
import { PaginationDto } from "src/core/dto/pagination.dto"
import { UpdateCarDto } from "../dto/update-car.dto"
import { FilterCarDto } from "../dto/filter-car.dto"

export interface CarsServiceInterface {
    create(
        createCarDto: CreateCarDto, 
        files?: Array<Express.Multer.File>
    ): Promise<ResultCreateCarDto>

    findAll(): Promise<Car[]>

    findAllWithFilter(
        filterCar: FilterCarDto
    ): Promise<Car[]>

    findOne(
        id: number
    ): Promise<Car>

    update(
        id: number, 
        updateCarDto: UpdateCarDto
    ): Promise<Car>
      
    remove(
        id: number
    ): Promise<Car>
      
}