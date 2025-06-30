import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService }                  from '../prisma/prisma.service';
import { CreateQuestionDto }              from './dto/create-question.dto';
import { UpdateQuestionDto }              from './dto/update-question.dto';

@Injectable()
export class DiagnosticQuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.diagnosticQuestion.findMany({
      orderBy: { order: 'asc' },
      include: { options: true },
    });
  }

  async findOne(id: number) {
    const question = await this.prisma.diagnosticQuestion.findUnique({
      where: { id },
      include: { options: true },
    });
    if (!question) throw new NotFoundException('Question non trouvée');
    return question;
  }

  async create(dto: CreateQuestionDto) {
    return this.prisma.diagnosticQuestion.create({
      data: {
        text:  dto.text,
        order: dto.order,
        options: {
          create: dto.options.map(opt => ({
            label:  opt.label,
            points: opt.points,
          })),
        },
      },
      include: { options: true },
    });
  }

  async update(id: number, dto: UpdateQuestionDto) {
    // Vérifier l’existence de la question
    await this.prisma.diagnosticQuestion.findUniqueOrThrow({ where: { id } });

    // Préparer les données de mise à jour
    const updateData: any = {
      text:  dto.text!,
      order: dto.order!,
    };

    if (dto.options) {
      // Supprimer d’abord les anciennes options
      await this.prisma.diagnosticOption.deleteMany({
        where: { questionId: id },
      });

      // Recréer les nouvelles options
      updateData.options = {
        create: dto.options.map(opt => ({
          label:  opt.label,
          points: opt.points,
        })),
      };
    }

    return this.prisma.diagnosticQuestion.update({
      where: { id },
      data: updateData,
      include: { options: true },
    });
  }

  async remove(id: number) {
    // Supprimer d'abord toutes les options liées
    await this.prisma.diagnosticOption.deleteMany({
      where: { questionId: id },
    });
    // Puis supprimer la question
    return this.prisma.diagnosticQuestion.delete({
      where: { id },
    });
  }
}
