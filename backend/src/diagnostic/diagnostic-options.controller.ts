// backend/src/diagnostic/diagnostic-options.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DiagnosticOptionsService } from './diagnostic-options.service';
import { CreateDiagnosticOptionDto } from './dto/create-option.dto';
import { UpdateDiagnosticOptionDto } from './dto/update-option.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('diagnostic-questions/:questionId/options')
export class DiagnosticOptionsController {
  constructor(private svc: DiagnosticOptionsService) {}

  @Get()
  findAll(@Param('questionId', ParseIntPipe) qid: number) {
    return this.svc.findAll(qid);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  create(
    @Param('questionId', ParseIntPipe) qid: number,
    @Body() dto: CreateDiagnosticOptionDto,
  ) {
    return this.svc.create({ ...dto, questionId: qid });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDiagnosticOptionDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
