import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from 'src/core/services/prisma.service';
import { fromFetch } from 'rxjs/fetch';
import { catchError, concatMap, from, lastValueFrom, map, mergeMap, of, switchMap, tap, toArray } from 'rxjs';
import { Car } from '@prisma/client';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { PaginationDto } from 'src/core/dto/pagination.dto';

@Injectable()
export class CarsService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(createCarDto: CreateCarDto) {
    const car = await this.prisma.car.create({
      data: {
        name: createCarDto.name,
        color: createCarDto.color,
        price: createCarDto.price,
        status: createCarDto.status,
      }
    });
    return car;
  }

  async findAll() {
    try {
      const cars = await this.prisma.car.findMany();
      return cars;
    } catch (error) {
      throw new ExceptionsHandler
    }
  }

  async findAllWithPagination(pagination: PaginationDto) {
    try {
      const order: any = {}

      if (pagination.orderBy) {
        order[pagination.orderBy] = pagination.sortOrder
      } else {
        order['id'] = pagination.sortOrder
      }

      const cars = await this.prisma.car.findMany({
        take: pagination.limit,
        skip: (pagination.page - 1) * pagination.limit,
        orderBy: order
      });
      return cars;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const car = await this.prisma.car.findUnique({
        where: {
          id: id
        }
      })
      if (!car) {
        throw new NotFoundException(`car with ${id} does not exist`)
      }
      return car;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException
    }
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    try {
      const findCar = await this.prisma.car.findUnique({
        where: {
          id: id
        }
      })
  
      if (!findCar) {
        throw new NotFoundException(`Car with id ${id} not found`)
      }
      const car = await this.prisma.car.update({
        where: {
          id: id
        },
        data: {
          name: updateCarDto.name,
          color: updateCarDto.color,
          price: updateCarDto.price,
          status: updateCarDto.status,
        }
      });
      
      return car;
    } catch (error) {
      if (error instanceof NotFoundException){
        throw error
      }
      throw new InternalServerErrorException
    }
  }

  async remove(id: number) {
    try {
      const findcar = await this.prisma.car.findUnique({
        where: {
          id: id
        }
      })
  
      if (!findcar) {
        throw new NotFoundException(`Car with id ${id} not found`)
      }
  
      const car = await this.prisma.car.delete({
        where: {
          id: id
        }
      });
      return car;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException
    }
  }


  inputRandomCars() {
    const data$ = fromFetch('https://freetestapi.com/api/v1/cars').pipe(
      switchMap(response => {
        if (response.ok) {
          // OK return data
          return from(response.json());
        } else {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${ response.status }` });
        }
      }),
      mergeMap( (cars: Car[]) => {
        return from(cars).pipe(
          concatMap((item:any) => {
            const data: CreateCarDto = {
              name: item.make + ' ' + item.model,
              color: item.color,
              price: item.price,
              status: 'active'
            }
            return from(this.create(data)).pipe(
              catchError((err, cought) => {
                // Tangkap error dan kembalikan objek error dengan pesan yang sesuai
                console.error('Error saat menyimpan data ke database:', err.message);
                return of({
                    data: data,
                    error: true,
                    message: 'Gagal menyimpan data ke database: ' + err.message // Gunakan pesan error dari err
                });
              }),
              map((response: any) => ({
                  data: response.error ? response.data : response,
                  error: response.error ? response.error : false,
                  message: response.error ? response.message : 'Car berhasil dibuat',
              }))
            )
          }),
          toArray()
        )
      })
    )

    const result = data$

    return result

  }
}
