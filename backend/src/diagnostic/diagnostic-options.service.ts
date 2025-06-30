// backend/src/diagnostic/diagnostic-options.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiagnosticOptionDto } from './dto/create-option.dto';
import { UpdateDiagnosticOptionDto } from './dto/update-option.dto';

@Injectable()
export class DiagnosticOptionsService {
  constructor(private prisma: PrismaService) {}

  findAll(questionId: number) {
    return this.prisma.diagnosticOption.findMany({
      where: { questionId },
    });
  }

  async create(dto: CreateDiagnosticOptionDto) {
    // vérifier que la question existe
    await this.prisma.diagnosticQuestion.findUniqueOrThrow({
      where: { id: dto.questionId },
    });
    return this.prisma.diagnosticOption.create({ data: dto });
  }

  async update(id: number, dto: UpdateDiagnosticOptionDto) {
    await this.prisma.diagnosticOption.findUniqueOrThrow({ where: { id } });
    return this.prisma.diagnosticOption.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.prisma.diagnosticOption.findUniqueOrThrow({ where: { id } });
    return this.prisma.diagnosticOption.delete({ where: { id } });
  }
}
