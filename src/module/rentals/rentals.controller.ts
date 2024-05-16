import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Query, Req } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles/roles.guard';
import { Request, Response } from 'express';
import { BaseController } from 'src/core/base.controller';
import { IdParam } from '../cities/dto/param.dto';
import { Rental } from '@prisma/client';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { FilterRentalDto } from './dto/filter-rental.dto';
import { RolesEnum } from 'src/core/enum/roles.enum';
import { TotalCostRentalDto } from './dto/total-cost-rental.dto';

@Controller('rentals')
@ApiTags('Rentals')
export class RentalsController extends BaseController{
  constructor(private readonly rentalsService: RentalsService) {
    super()
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createRentalDto: CreateRentalDto,
    @Req() request: Request,
    @Res() response: Response
  ) {
    try {
      const data = await this.rentalsService.create(createRentalDto, request.user)
      return this.successResponse(
        response,
        data,
        null,
        200,
        'Success Create Rental'
      );
    } catch (error) {
      this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() response: Response
  ) {
    try {
      const data = await this.rentalsService.findAll();
      return this.successResponse<Rental[]>(
        response,
        data,
        null,
        200,
        'Success Get All Data Rentals'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Get('pagination')
  @UseGuards(JwtAuthGuard)
  async findAllWithPagination(
    @Query() filter: FilterRentalDto,
    @Req() request: Request,
    @Res() response: Response
  ){
    try {
      const data = await this.rentalsService.findAllWithFilter(filter, request.user)
      return this.successResponse<Rental[]>(
        response,
        data,
        filter,
        200,
        'Success get rentals with'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Get('total-cost/:id')
  async getTotalCost(
    @Param() param: IdParam,
    @Query() query: TotalCostRentalDto,
    @Res() response: Response
  ) {
    try {
      const data = await this.rentalsService.getTotalCost(query, param.id)
      return this.successResponse(
        response,
        data,
        null,
        200,
        'Success get total cost'
      )
    } catch(error) {
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
      const data = await this.rentalsService.findOne(param.id);
      return this.successResponse<Rental>(
        response,
        data,
        null,
        200,
        'Success Get Rental by Id'
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
  @UseGuards(JwtAuthGuard)
  async update(
    @Param() param: IdParam, 
    @Body() updateRentalDto: UpdateRentalDto,
    @Res() response: Response
  ) {
    try {
      const data = await this.rentalsService.update(param.id, updateRentalDto);
      return this.successResponse<Rental>(
        response,
        data,
        null,
        200,
        'Success Get Rental by Id'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Patch('update-status/:id')
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateStatus(
    @Param() param: IdParam,
    @Body() updateStatusBody: UpdateRentalDto,
    @Res() response: Response
  ) {
    try {
      const data = await this.rentalsService.updateStatus(param.id, updateStatusBody)
      return this.successResponse(
        response,
        data,
        null,
        200,
        'Success Update Status Rental'
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
      const data = await this.rentalsService.remove(param.id);
      return this.successResponse<Rental>(
        response,
        data,
        null,
        200,
        'Success Delete Rental'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Get('test/test')
  @UseGuards(JwtAuthGuard)
  test(
    @Param('id') id: string,
    @Res() response: Response
  ) {
    try {
      return this.rentalsService.testrxjs();
    } catch ( error ) {
      return response.status(error.statusCode).json({
        message: error.message
      })
    }
  }
}
