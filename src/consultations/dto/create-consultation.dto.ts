import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ConsultationsStatus } from '../enum/consultations-status.enum';
import { ConsultationsType } from '../enum/consultations-type.enum';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsString()
  readonly doctorId: string;

  @IsNotEmpty()
  @IsString()
  readonly patientId: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ConsultationsStatus)
  readonly status: ConsultationsStatus;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ConsultationsType)
  readonly type: ConsultationsType;

  @IsString()
  familyId: string;

  @IsNotEmpty()
  @IsDateString()
  readonly date: Date;

  @IsString()
  readonly place: string;

  @IsArray()
  readonly observations: []; // TODO: crear tipo como corresponde, DTO, para que valide los internos, y una UNA INTERFAZ

  @IsArray()
  readonly prescriptions: []; // TODO: crear tipo como corresponde, DTO, para que valide los internos, y una UNA INTERFAZ

  @IsArray()
  readonly exams: []; // TODO: crear tipo como corresponde, DTO, para que valide los internos, y una UNA INTERFAZghgh

  @IsArray()
  readonly quote: []; // AQUI UNA INTERFAZ, o el DTO,, ya lo cree en uptate dto
}
