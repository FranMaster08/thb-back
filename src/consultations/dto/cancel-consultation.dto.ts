import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ConsultationsStatus } from '../enum/consultations-status.enum';

export class CancelConsultationDto {
  @IsNotEmpty()
  @IsArray()
  observations: [];
}
