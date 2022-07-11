import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UpdateDoctorUserDto } from './update-doctor-user.dto';
import { UpdateDoctorDto } from './update-doctor.dto';

export class UpdateDoctorAndUserDto {
  // @IsInstance(UpdateDoctorUserDto)

  @ValidateNested()
  @Type(() => UpdateDoctorUserDto)
  readonly user: UpdateDoctorUserDto;

  @ValidateNested()
  @Type(() => UpdateDoctorDto)
  readonly doctorDetail: UpdateDoctorDto;
}
