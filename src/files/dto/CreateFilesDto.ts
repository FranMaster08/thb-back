import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FileExtension, FileContext } from '../enum/files.enum';

class FileDto {
  @IsEnum(FileExtension)
  readonly extension: FileExtension;

  @IsString()
  @IsNotEmpty()
  readonly base64: string;
}

export class CreateFilesDto {
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  readonly patientId: string;

  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  readonly doctorId: string;

  @IsEnum(FileContext)
  readonly context: FileContext;

  @IsString()
  readonly consultationId: string;

  @IsString()
  readonly medicalHistoryId: string;

  @ValidateNested({ each: true })
  @Type(() => FileDto)
  @IsArray()
  @IsNotEmpty()
  readonly files: FileDto[];
}
