import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { PrismaService } from '../../core/services/prisma.service';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { fromFetch } from 'rxjs/fetch';
import { catchError, concat, concatMap, from, lastValueFrom, map, mergeMap, of, switchMap, tap, toArray } from 'rxjs';
import { City } from '@prisma/client';
import { generateRandomCityCode } from 'src/core/utils/common.utils';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CitiesService {
constructor(
  private readonly prisma: PrismaService,
  private readonly httpService: HttpService
) {}

  async create(createCityDto: CreateCityDto) {
    try {
      const city = await this.prisma.city.create({
        data: {
          name: createCityDto.name,
          code: createCityDto.code,
        }
      });
      return city;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async importCity(id: string) {
    try {
      const data$ = fromFetch(`https://staggingabsensi.labura.go.id/api-wilayah-indonesia/static/api/regencies/${id}.json`).pipe(
        switchMap(response => {
          if (response.ok) {
            // OK return data
            return response.json();
          } else {
            // Server is returning a status requiring the client to try something else.
            return of({ error: true, message: `Error ${ response.status }` });
          }
        }),
        catchError(err => {
          throw new InternalServerErrorException(err.message)
        }),
        mergeMap((cities) => {
          return from(cities).pipe(
            concatMap((city: City) => {
              const data: CreateCityDto = {
                name: city.name,
                code: generateRandomCityCode()
              }
              return from(this.create(data)).pipe(
                catchError(err => {
                  return of({
                    data: data,
                    error: true,
                    statusCode: err.response.statusCode,
                    message: 'Gagal menyimpan data ke database: ' + err.response.message
                  })
                }),
                map((response: any) => ({
                    data: response.error ? response.data : response,
                    error: response.error ? response.error : false,
                    statusCode: response.error ? response.statusCode : 201,
                    message: response.error ? response.message : 'City berhasil dibuat',
                }))
              )
            }),
            toArray()
          )
        })
      );
      
      return lastValueFrom(data$);
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      const cities = await this.prisma.city.findMany();
      return cities;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
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

      const cities = await this.prisma.city.findMany({
        take: pagination.limit,
        skip: (pagination.page - 1) * pagination.limit,
        orderBy: order
      });
      return cities;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const city = await this.prisma.city.findUnique({
        where: {
          id: id
        }
      })
      if (!city) {
        throw new NotFoundException(`City with ${id} does not exist`)
      }
      return city;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error 
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    try {
      const findCity = await this.prisma.city.delete({
        where: {
          id: id
        }
      })

      if (!findCity) {
        throw new NotFoundException('City with id not found')
      }

      const city = await this.prisma.city.update({
        where: {
          id: id
        },
        data: {
          name: updateCityDto.name,
          code: updateCityDto.code,
        }
      });
      
      return city;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error 
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
      const findCity = await this.prisma.city.findUnique({
        where: {
          id: id
        }
      })
      if (!findCity) {
        throw new NotFoundException(`City with id ${id} not found`)
      }

      await this.prisma.city.delete({
        where: {
          id: id
        }
      });
      return findCity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error 
      }
      throw new InternalServerErrorException(error.message)
    }
  }
}
