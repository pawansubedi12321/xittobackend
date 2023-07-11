import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {ResponseMessage} from "../core/decorators/response.decorator";
import {ADDED, DELETED, RECEIVED, UPDATED} from "../utils/response.constants";
import {DeleteDateColumn} from "typeorm";

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('create')
  @ResponseMessage(ADDED)
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get('all')
  @ResponseMessage(RECEIVED)

  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ResponseMessage(RECEIVED)

  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Put('update/status/:id')
  @ResponseMessage(UPDATED)

  updateStatus(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.updateStatus(id, updateServiceDto);
  }

   @Put('update/service/:id')
  @ResponseMessage(UPDATED)

  updateService(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  @ResponseMessage(DELETED)

  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
