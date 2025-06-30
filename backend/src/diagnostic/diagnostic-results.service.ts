// backend/src/diagnostic/diagnostic-results.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiagnosticResultDto } from './dto/create-result.dto';
import { UpdateDiagnosticResultDto } from './dto/update-result.dto';

@Injectable()
export class DiagnosticResultsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.diagnosticResult.findMany({
      orderBy: { minScore: 'asc' },
    });
  }

  async create(dto: CreateDiagnosticResultDto) {
    return this.prisma.diagnosticResult.create({ data: dto });
  }

  async update(id: number, dto: UpdateDiagnosticResultDto) {
    await this.prisma.diagnosticResult.findUniqueOrThrow({ where: { id } });
    return this.prisma.diagnosticResult.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.prisma.diagnosticResult.findUniqueOrThrow({ where: { id } });
    return this.prisma.diagnosticResult.delete({ where: { id } });
  }
}
