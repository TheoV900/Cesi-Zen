import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { DiagnosticQuestionsController } from './diagnostic-questions.controller';
import { DiagnosticQuestionsService }    from './diagnostic-questions.service';

import { DiagnosticOptionsController }   from './diagnostic-options.controller';
import { DiagnosticOptionsService }      from './diagnostic-options.service';

import { DiagnosticResultsController }   from './diagnostic-results.controller';
import { DiagnosticResultsService }      from './diagnostic-results.service';

import { DiagnosticController }          from './diagnostic.controller';
import { DiagnosticService }             from './diagnostic.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    DiagnosticQuestionsController,
    DiagnosticOptionsController,
    DiagnosticResultsController,
    DiagnosticController,
  ],
  providers: [
    DiagnosticQuestionsService,
    DiagnosticOptionsService,
    DiagnosticResultsService,
    DiagnosticService,
  ],
})
export class DiagnosticModule {}
