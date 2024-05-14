import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class IdParam {
    @IsInt()
    @Type( ()=>Number )
    id: number
}