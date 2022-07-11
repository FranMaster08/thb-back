import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Day } from '../../shared/enum/day.enum';

export class DtoScheduleDay {
  @IsEnum(Day)
  @IsNotEmpty()
  day: Day;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  until: string;

  @IsNotEmpty()
  @IsNumber()
  numberConsultations: number;
}
