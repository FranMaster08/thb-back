import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class QuoteDto {
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  service: string;

  @IsNumber()
  cost: number;
}

export class UpdateConsultationDto {
  @ArrayNotEmpty()
  @IsArray()
  readonly observations: [];

  @IsArray()
  readonly prescriptions: [];

  @IsArray()
  readonly exams: [];

  @ValidateNested({ each: true })
  @Type(() => QuoteDto)
  @IsArray()
  readonly quote: QuoteDto[];
}
