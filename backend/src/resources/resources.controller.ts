import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';


@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  /**
   * GET /resources?archived=false
   * archived vient en string, on caste en bool
   */
  @Get()
  findAll(@Query('archived') archived = 'false') {
    return this.resourcesService.findAll(archived === 'true');
  }

  /**
   * GET /resources/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.findOne(id);
  }

  /**
   * POST /resources
   * Création réservée aux ADMIN
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  create(@Body() dto: CreateResourceDto) {
    return this.resourcesService.create(dto);
  }

  /**
   * PATCH /resources/:id
   * Mise à jour réservée aux ADMIN
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(id, dto);
  }

  /**
   * DELETE /resources/:id
   * Suppression réservée aux ADMIN
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.remove(id);
  }
}