import { CarPhoto } from "@prisma/client"
import { Exclude, Expose } from "class-transformer"

export class ResultCreateCarDto {
    @Exclude()
    id: Number
    @Expose()
    name: string
    @Expose()
    color: string
    @Expose()
    price: number
    @Expose()
    status: string
    @Expose()
    carPhotos: CarPhoto[]
}