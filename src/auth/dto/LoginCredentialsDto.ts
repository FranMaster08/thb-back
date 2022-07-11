import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginCredentialsDto {
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsEmail()
  readonly username: string;

  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  readonly password: string;
}
