import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, Res } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CityEntity } from './entity/city.entity';
import { Roles } from 'src/core/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles/roles.guard';
import { Response } from 'express';
import { BaseController } from 'src/core/base.controller';
import { City } from '@prisma/client';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { IdParam } from './dto/param.dto';
import { RolesEnum } from 'src/core/enum/roles.enum';

@Controller('cities')
@ApiTags('City')
export class CitiesController extends BaseController {
  constructor(private readonly citiesService: CitiesService) {
    super()
  }

  @Post()
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCreatedResponse({ type: CityEntity })
  async create(
    @Body() createCityDto: CreateCityDto, 
    @Res() response: Response
  ) {
    try {
      const data = await this.citiesService.create(createCityDto);
      return this.successResponse<City>(
        response,
        data,
        null,
        201,
        'Success Create Data City'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Post('/import/:id')
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async importCity(
    @Param('id') id: string,
    @Res() response: Response
  ) {
    try {
      const data = await this.citiesService.importCity(id);
      return this.successResponse(
        response,
        data,
        null,
        201,
        'Success Create Data City'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CityEntity, isArray: true })
  async findAll(
    @Res() response: Response
  ) {
    try {
      const data = await this.citiesService.findAll()
      return this.successResponse<City[]>(
        response, 
        data, 
        null, 
        200,
        'Success get all cities'
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
  @ApiOkResponse({ type: CityEntity, isArray: true })
  async findAllWithPagination(
    @Query() pagination: PaginationDto,
    @Res() response: Response
  ) {
    try {
      const data = await this.citiesService.findAllWithPagination(pagination)
      return this.successResponse<City[]>(
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
  @ApiOkResponse({ type: CityEntity })
  async findOne(
    @Param() param: IdParam,
    @Res() response: Response
  ) {
    try {
      const data = await this.citiesService.findOne(param.id);
      return this.successResponse<City>(
        response,
        data,
        null,
        200,
        'Success get City with id'
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
  @ApiOkResponse({ type: CityEntity })
  async update(
    @Param() param: IdParam, 
    @Body() updateCityDto: UpdateCityDto,
    @Res() response: Response
  ) {
    try {
      const data = await this.citiesService.update(param.id, updateCityDto);
      return this.successResponse<City>(
        response,
        data,
        null,
        200,
        'Success Update City Data'
      )

    } catch (error) {
      throw this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Delete(':id')
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: CityEntity })
  async remove(
    @Param() param: IdParam,
    @Res() response: Response
  ) {
    try {
      const data = await this.citiesService.remove(param.id);
      return this.successResponse<City>(
        response,
        data,
        null,
        200,
        'Success Delete City'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }
}
