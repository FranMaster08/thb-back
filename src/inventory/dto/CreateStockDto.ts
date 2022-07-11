import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateStockDto {
  @MinLength(36)
  @MaxLength(36)
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  doctorId: string;

  @MinLength(5)
  @MaxLength(10)
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  sku: string;

  @MinLength(5)
  @MaxLength(50)
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  name: string;

  @Max(10000000)
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}
