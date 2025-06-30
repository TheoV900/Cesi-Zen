// backend/src/diagnostic/diagnostic.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';
import { EvaluateDiagnosticDto } from './dto/evaluate.dto';

@Controller('diagnostic')
export class DiagnosticController {
  constructor(private svc: DiagnosticService) {}

  @Post('evaluate')
  evaluate(@Body() dto: EvaluateDiagnosticDto) {
    return this.svc.evaluate(dto);
  }
}
