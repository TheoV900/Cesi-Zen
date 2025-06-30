// backend/src/diagnostic/dto/update-result.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDiagnosticResultDto } from './create-result.dto';

export class UpdateDiagnosticResultDto extends PartialType(
  CreateDiagnosticResultDto,
) {}
