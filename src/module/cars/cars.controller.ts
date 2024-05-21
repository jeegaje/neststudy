import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, UploadedFiles } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles/roles.guard';
import { Response, Express } from 'express';
import { BaseController } from 'src/core/base.controller';
import { IdParam } from '../cities/dto/param.dto';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { Car } from '@prisma/client';
import { RolesEnum } from 'src/core/enum/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CarPhotoFileValidator } from './utils/car-photo-file.validator';
import { FilterCarDto } from './dto/filter-car.dto';
import { Workbook } from 'exceljs';
import { Multer } from 'multer';

@Controller('cars')
@ApiTags('Cars')
export class CarsController extends BaseController {
  constructor(private readonly carsService: CarsService) {
    super()
  }

  @Post()
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles(CarPhotoFileValidator) files: Array<Express.Multer.File>,
    @Body() createCarDto: CreateCarDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.carsService.create(createCarDto, files);
      return this.successResponse(
        response,
        data,
        null,
        201,
        'Success Create Car'
      )
    } catch (error){
      return this.errorResponse(
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
    @Query() filter: FilterCarDto,
    @Res() response: Response
  ) {
    try {
      const data = await this.carsService.findAllWithFilter(filter)
      return this.successResponse<Car[]>(
        response,
        data,
        filter,
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

  @Get('/export/excel')
  async exportToExcel(
    @Res() response: Response
  ) {
    try {
      await this.carsService.exportCarsToExcel(response);
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message
      )
    }
  }

  @Post('/import/excel')
  @UseInterceptors(FilesInterceptor('files'))
  async importFromExcel(
    @Res() response: Response,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    try {
      const data = await this.carsService.importCarsFromExcel(files);
      return this.successResponse(
        response,
        data,
        null,
        200,
        'sucess'
      )
    } catch (error) {
      return this.errorResponse(
        response,
        error.response.statusCode,
        error.response.message,
        error.response.error
      )
    }
  }

}
