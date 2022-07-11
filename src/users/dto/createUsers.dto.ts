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
import { RoleType } from '../../role/roletype.enum';
import { GenderType } from '../enum/gender.enum';

export class CreateUserDto {
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
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(RoleType)
  readonly role: RoleType;

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
