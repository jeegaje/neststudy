import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles/roles.guard';
import { Response } from 'express';
import { BaseController } from 'src/core/base.controller';
import { IdParam } from '../cities/dto/param.dto';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { Car } from '@prisma/client';
import { RolesEnum } from 'src/core/enum/roles.enum';

@Controller('cars')
@ApiTags('Cars')
export class CarsController extends BaseController {
  constructor(private readonly carsService: CarsService) {
    super()
  }

  @Post()
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() response: Response
  ) {
    try {
      const data = await this.carsService.findAll();
      return this.successResponse<Car[]>(
        response,
        data,
        null,
        200,
        'Success Get All Cars'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Get('/pagination')
  @UseGuards(JwtAuthGuard)
  async findAllWithPagination(
    @Query() pagination: PaginationDto,
    @Res() response: Response
  ) {
    try {
      const data = await this.carsService.findAllWithPagination(pagination)
      return this.successResponse<Car[]>(
        response,
        data,
        pagination,
        200,
        'Success get cities with pagination'
      );
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param() param: IdParam,
    @Res() response: Response
  ) {
    try {
      const data = await this.carsService.findOne(param.id);
      return this.successResponse<Car>(
        response,
        data,
        null,
        200,
        'Success Get Car By Id'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Patch(':id')
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param() param: IdParam, 
    @Body() updateCarDto: UpdateCarDto,
    @Res() response: Response
  ) {
    try {
      const data = await this.carsService.update(param.id, updateCarDto);
      return this.successResponse<Car>(
        response,
        data,
        null,
        200,
        'Success Update Car'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Delete(':id')
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(
    @Param() param: IdParam,
    @Res() response: Response
  ) {
    try {
      const data = await this.carsService.remove(param.id);
      return this.successResponse<Car>(
        response,
        data,
        null,
        200,
        'Success Delete Car'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }


  @Post('input/random')
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  inputRandomCars() {
      return this.carsService.inputRandomCars();
  }

}
