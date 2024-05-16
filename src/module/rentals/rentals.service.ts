import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { PrismaService } from 'src/core/services/prisma.service';
import { from, mergeMap, map, lastValueFrom } from 'rxjs';
import { Car, Rental, User } from '@prisma/client';
import { FilterRentalDto } from './dto/filter-rental.dto';
import { RolesEnum } from 'src/core/enum/roles.enum';
import { TotalCostRentalDto } from './dto/total-cost-rental.dto';
import { getDistance } from 'geolib';
import { MidtransService } from 'src/core/services/midtrans.service';

@Injectable()
export class RentalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly midtrans: MidtransService
  ) {}

  private async findRental(id: number) {
    return await this.prisma.rental.findUnique({
      where: {
        id: id
      }
    })
  }

  async create(createRentalDto: CreateRentalDto, request: Partial<User>) {
    try {
      const rental = await this.prisma.rental.create({
        data: {
          car_id: createRentalDto.car_id,
          user_id: request.id,
          rent_date: new Date(createRentalDto.rent_date),
          return_date: new Date(createRentalDto.return_date),
          status: createRentalDto.status,
          rent_cost: createRentalDto.rent_cost,
          city_id: createRentalDto.city_id
        },
        include: {
          user: {
            select: {
              username: true,
            }
          },
          city: {
            select: {
              name: true,
            }
          },
          car: {
            select: {
              name: true,
            }
          }
        }
      });

      const transaction = await this.midtrans.createMandiriCharge(rental, request)
      
      await this.prisma.payment.create({
        data: {
          paymentType: 'Mandiri',
          grossAmount: createRentalDto.rent_cost,
          status: 'pending',
          meta: transaction,
          rentalId: rental.id
        }
      })

      return rental;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      const rentals = await this.prisma.rental.findMany({
        include: {
          user: {
            select: {
              username: true,
            }
          },
          city: {
            select: {
              name: true,
            }
          },
          car: {
            select: {
              name: true,
            }
          }
        }
      });
      return rentals;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAllWithFilter(query: FilterRentalDto, user: Partial<User>) {
    try {
      const { page, limit, orderBy, sortOrder, ...filter } = query

      const order: any = {}

      if (orderBy) {
        order[orderBy] = sortOrder
      } else {
        order['id'] = sortOrder
      }

      // Admin can see all rental
      // Customer can see 

      if (user.role != RolesEnum.ADMIN) {
        Object.assign(filter, { user_id: user.id });
      }

      const rentals = await this.prisma.rental.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: order,
        where: filter,
        include: {
          user: {
            select: {
              username: true,
            }
          },
          city: {
            select: {
              name: true,
            }
          },
          car: {
            select: {
              name: true,
            }
          }
        }
      });
      return rentals;
    } catch(error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const rental = await this.prisma.rental.findUnique({
        where: {
          id: id
        },
        include: {
          user: {
            select: {
              username: true,
            }
          },
          city: {
            select: {
              name: true,
            }
          },
          car: {
            select: {
              name: true,
            }
          }
        }
      })
      if (!rental) {
        throw new NotFoundException(`rental with ${id} does not exist`)
      }
      return rental;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  async getTotalCost(query: TotalCostRentalDto, id: number) {
    const rental = await this.prisma.rental.findUnique({
      where: {
        id: id
      }
    })

    const city = await this.prisma.city.findUnique({
      where: {
        id: query.city_id
      }
    })

    const car = await this.prisma.car.findUnique({
      where: {
        id: query.car_id
      }
    })

    const startDate = new Date(rental.rent_date);
    const endDate = new Date(rental.return_date);

    const difference = endDate.getTime() - startDate.getTime();

    const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));

    const distance = getDistance(
      { latitude: -6.17944, longitude: 106.62991 },
      { latitude: city.latitude, longitude: city.longitude },
      100000
    ) / 100000;

    let totalCost = car.price * daysDifference

    if (distance) {
      totalCost += distance * 100000
    }

    return {
      totalCost: totalCost,
      city: city.name,
      car: car.name,
      rent_date: rental.rent_date,
      return_date: rental.return_date
    }
  }

  async update(id: number, updateRentalDto: UpdateRentalDto) {
    try {
      const findRental = await this.prisma.rental.findUnique({
        where: {
          id: id
        }
      })
      if (!findRental) {
        throw new NotFoundException('Rental with id not found')
      }
      const rental = await this.prisma.rental.update({
        where: {
          id: id
        },
        data: {
          car_id: updateRentalDto.car_id,
          rent_date: new Date(updateRentalDto.rent_date),
          return_date: new Date(updateRentalDto.return_date),
          rent_cost: updateRentalDto.rent_cost,
          city_id: updateRentalDto.city_id
        },
        include: {
          user: {
            select: {
              username: true,
            }
          },
          city: {
            select: {
              name: true,
            }
          },
          car: {
            select: {
              name: true,
            }
          }
        }
      });
      return rental;
    } catch (error) {
      if (error instanceof NotFoundException){
        throw error
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateStatus(id: number, body: UpdateRentalDto) {
    try {
      if (! await this.findRental(id)) {
        throw new NotFoundException('Rental with id not found')
      }
      const rental = await this.prisma.rental.update({
        where: {
          id: id
        },
        data: {
          status: body.status
        }
      })
      return rental;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
      if (! await this.findRental(id)) {
        throw new NotFoundException('Rental with id not found')
      }
      const rental = await this.prisma.rental.delete({
        where: {
          id: id
        }
      });
      return rental;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(error.message)
    }
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
