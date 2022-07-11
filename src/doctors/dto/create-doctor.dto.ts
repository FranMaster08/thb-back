import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInstance,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  IFiles,
  IProfessionalBackgroud,
  IScheduleDay,
} from '../../shared/interfaces/doctor.interfaces';
import { DtoScheduleDay } from './schedule-day.dto';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsObject()
  readonly files: IFiles;

  @IsObject()
  readonly professionalBackgroud: IProfessionalBackgroud;

  @IsNotEmpty()
  @IsString()
  readonly specialty: string;

  @IsNotEmpty()
  @IsString()
  readonly collegiateNumber: string;

  @IsArray()
  readonly consultationRooms: string[];

  @IsArray()
  readonly insuranceCompanies: string[];

  @Type(() => DtoScheduleDay)
  @ValidateNested({ each: true })
  @IsInstance(DtoScheduleDay, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  readonly schedule: IScheduleDay[];
}
