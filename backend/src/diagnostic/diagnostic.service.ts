// backend/src/diagnostic/diagnostic.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EvaluateDiagnosticDto } from './dto/evaluate.dto';

@Injectable()
export class DiagnosticService {
  constructor(private prisma: PrismaService) {}

  async evaluate(dto: EvaluateDiagnosticDto) {
    if (!dto.answers?.length) {
      throw new BadRequestException('Aucune réponse fournie');
    }

    // Récupérer tous les options sélectionnées
    const options = await this.prisma.diagnosticOption.findMany({
      where: { id: { in: dto.answers.map(a => a.optionId) } },
    });

    const total = options.reduce((sum, opt) => sum + opt.points, 0);

    // Trouver le palier de résultat
    const result = await this.prisma.diagnosticResult.findFirst({
      where: { minScore: { lte: total }, maxScore: { gte: total } },
    });

    return { total, result };
  }
}
