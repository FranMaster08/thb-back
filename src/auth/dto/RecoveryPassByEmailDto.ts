import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class RecoveryPassSendEmailDto {
  @Transform(({ value }) => (value ? value.toString().trim() : value))
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}

export class RecoveryPassByEmailDto {
  @MinLength(36)
  @Transform(({ value }) => (value ? value.toString().trim() : value))
  @IsNotEmpty()
  @IsString()
  userId: string;

  @MinLength(36)
  @Transform(({ value }) => (value ? value.toString().trim() : value))
  @IsNotEmpty()
  @IsString()
  tokenPasswordRecovery: string;

  @Transform(({ value }) => (value ? value.toString().trim() : value))
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  password: string;
}
