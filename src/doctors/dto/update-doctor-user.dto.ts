import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderType } from '../../users/enum/gender.enum';

export class UpdateDoctorUserDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  // @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MaxLength(12)
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  readonly dni: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(GenderType)
  readonly gender: GenderType;

  @IsNotEmpty()
  @IsDateString()
  readonly birthDate: Date;

  @IsString()
  readonly familyId: string;

  @IsNotEmpty()
  @MinLength(36)
  @MaxLength(36)
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  readonly medicalCenterId: string;
}
