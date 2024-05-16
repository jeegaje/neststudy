import { ApiProperty } from "@nestjs/swagger";
import { City } from "@prisma/client";

export class CityEntity implements City {
    @ApiProperty()
    id: number;
    @ApiProperty()
    code: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    latitude: number;
    @ApiProperty()
    longitude: number;
}