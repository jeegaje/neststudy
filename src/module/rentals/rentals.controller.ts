import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles/roles.guard';
import { Response } from 'express';

@Controller('rentals')
@ApiTags('Rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalsService.create(createRentalDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.rentalsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto) {
    return this.rentalsService.update(+id, updateRentalDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(+id);
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
