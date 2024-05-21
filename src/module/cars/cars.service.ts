import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from 'src/core/services/prisma.service';
import { fromFetch } from 'rxjs/fetch';
import { catchError, concatMap, from, lastValueFrom, map, max, mergeMap, of, switchMap, tap, toArray } from 'rxjs';
import { Car, CarPhoto, Prisma } from '@prisma/client';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { ResultCreateCarDto } from './dto/result-create-care.dto';
import { plainToClass } from 'class-transformer';
import { CarsServiceInterface } from './interfaces/cars-service.interface';
import { FilterCarDto } from './dto/filter-car.dto';
import { Response } from 'express';
import { ExcelService } from 'src/core/services/excel.service';
import { Workbook } from 'exceljs';
import * as path from 'path'

@Injectable()
export class CarsService implements CarsServiceInterface{
  constructor(
    private readonly prisma: PrismaService,
    private readonly excel: ExcelService
  ) {}

  async create(createCarDto: CreateCarDto, files?: Array<Express.Multer.File>): Promise<ResultCreateCarDto> {
    try {
      let carPhotos: CarPhoto[] = []
      const car: Car = await this.prisma.car.create({
        data: {
          name: createCarDto.name,
          color: createCarDto.color,
          price: createCarDto.price,
          status: createCarDto.status,
        }
      });
      if (files.length != 0) {
        const carPhotos$ = from(files).pipe(
          concatMap((file) => {
            return from(this.prisma.carPhoto.create({
              data: {
                path: 'uploads/' + file.filename,
                description: file.originalname,
                car_id: car.id,
                size: file.size
              }
            }))
          }),
          toArray()
        )
        carPhotos = await lastValueFrom(carPhotos$)
      }
  
      const result: ResultCreateCarDto = plainToClass(ResultCreateCarDto, {
        ...car,
        carPhotos
      })
  
      return result;

    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      const cars = await this.prisma.car.findMany();
      return cars;
    } catch (error) {
      throw new ExceptionsHandler
    }
  }

  async findAllWithFilter(filterCar: FilterCarDto) {
    try {
      const { page, limit, orderBy, sortOrder, minPrice, maxPrice, name, ...filter } = filterCar
      const order: any = {}

      if (orderBy) {
        order[orderBy] = sortOrder
      } else {
        order['id'] = sortOrder
      }

      if (minPrice || maxPrice) {
        Object.assign(filter, { 
          price: {
            gte: minPrice ?? undefined,
            lte: maxPrice  ?? undefined
          } 
        })
      }

      if (name) {
        Object.assign(filter, { 
          name: {
            contains: name,
            mode: 'insensitive'
          } 
        })
      }

      const cars = await this.prisma.car.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: order,
        where: filter
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
              status: 'available'
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

  async exportCarsToExcel(response: Response) {
    try {
      const cars = await this.prisma.car.findMany()
      await this.excel.generateExcelFile<Car>(cars, 'Cars Data', response)
    } catch(error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async importCarsFromExcel(files: Array<Express.Multer.File>) {
    try {
      const data = await this.excel
      .setFilePath(files[0].filename)
      .buildToJsonWithDto<CreateCarDto>(CreateCarDto)


      return data;
    } catch(error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new InternalServerErrorException
    }
  }
}
