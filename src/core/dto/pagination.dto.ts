    import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator"
    import { SortOrder } from "../enum/sorting"
    import { Type } from "class-transformer"

    export class PaginationDto {
        @IsInt()
        @Type(()=>Number)
        page: number = 1

        @IsInt()
        @Type(()=>Number)
        limit: number = 5

        @IsEnum(SortOrder)
        @IsOptional()
        sortOrder: SortOrder = SortOrder.ASC

        @IsString()
        @IsOptional()
        orderBy: string = 'id'
    }