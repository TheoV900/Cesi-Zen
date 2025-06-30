// backend/src/diagnostic/dto/create-question.dto.ts
export class CreateQuestionDto {
  text: string;
  order: number;
  options: { label: string; points: number }[];
}
