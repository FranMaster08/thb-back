import { IsArray, IsDateString, IsNotEmpty } from 'class-validator';

export class RescheduleConsultationDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsArray()
  observations: [];
}
