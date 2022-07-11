import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicalHistoryDto {
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsArray()
  history: [];
}
