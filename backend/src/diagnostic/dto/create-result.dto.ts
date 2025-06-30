// backend/src/diagnostic/dto/create-result.dto.ts
export class CreateDiagnosticResultDto {
  minScore: number;
  maxScore: number;
  title: string;
  content: string;
}
