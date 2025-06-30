// backend/src/diagnostic/dto/evaluate.dto.ts
export class EvaluateDiagnosticDto {
  answers: { questionId: number; optionId: number }[];
}
