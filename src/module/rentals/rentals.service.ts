import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { PrismaService } from 'src/core/services/prisma.service';
import { from, mergeMap, map, lastValueFrom } from 'rxjs';
import { Car, Rental } from '@prisma/client';

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createRentalDto: CreateRentalDto) {
    const rental = await this.prisma.rental.create({
      data: {
        car_id: createRentalDto.car_id,
        user_id: createRentalDto.user_id,
        rent_date: createRentalDto.rent_date,
        return_date: createRentalDto.return_date,
        status: createRentalDto.status,
        rent_cost: createRentalDto.rent_cost,
        city_id: createRentalDto.city_id
      }
    });
    return rental;
  }

  async findAll() {
    const rentals = await this.prisma.rental.findMany();
    return rentals;
  }

  async findOne(id: number) {
    const rental = await this.prisma.rental.findUnique({
      where: {
        id: id
      },
      include: {
        user: true
      }
    })
    if (!rental) {
      throw new NotFoundException(`rental with ${id} does not exist`)
    }
    return rental;
  }

  async update(id: number, updateRentalDto: UpdateRentalDto) {
    const rental = await this.prisma.rental.update({
      where: {
        id: id
      },
      data: {
        car_id: updateRentalDto.car_id,
        user_id: updateRentalDto.user_id,
        rent_date: updateRentalDto.rent_date,
        return_date: updateRentalDto.return_date,
        status: updateRentalDto.status,
        rent_cost: updateRentalDto.rent_cost,
        city_id: updateRentalDto.city_id
      }
    });
    
    return rental;
  }

  async remove(id: number) {
    const rental = await this.prisma.rental.delete({
      where: {
        id: id
      }
    });
    return rental;
  }

  async testrxjs() {
    try {
      const rentals$ = from(this.prisma.rental.findMany()).pipe(
        mergeMap(( rental: Rental[]) => {
          return from(rental).pipe(
            mergeMap((rental) => {
              return from(this.prisma.car.findUnique({
                where: {
                  id: rental.car_id
                }
              })).pipe(
                map((car: Car) => {
                  return {
                    ...rental,
                    car: car
                  };
                })
              );
            }),
            map((rental: Rental) => {
              const { car_id, ...rentals } = rental
              return rentals
            })
          )
        })
      );
  
      const result = lastValueFrom(rentals$);
      return result;
    } catch (error) {
      throw new BadRequestException('Failed to get All Data')
    }
    
  }
}
