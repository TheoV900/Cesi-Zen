// backend/src/diagnostic/dto/update-option.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDiagnosticOptionDto } from './create-option.dto';

export class UpdateDiagnosticOptionDto extends PartialType(
  CreateDiagnosticOptionDto,
) {}
