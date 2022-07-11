import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDoctorDto {
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  readonly specialty: string;

  @IsNotEmpty()
  @Transform(({ value }) =>
    value && typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  readonly collegiateNumber: string;

  @IsArray()
  readonly consultationRooms: string[];
}
