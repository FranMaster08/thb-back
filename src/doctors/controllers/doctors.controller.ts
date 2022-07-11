import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IUser } from '../../shared/interfaces/users.interfaces';
import {
  TypeResponse,
  TypeResponseError,
} from '../../shared/types/response.type';
import { IScheduleDay } from '../../shared/interfaces/doctor.interfaces';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { DtoScheduleDay } from '../dto/schedule-day.dto';
import { UpdateDoctorAndUserDto } from '../dto/update-doctor-and-user.dto';
import { DoctorsEntity } from '../entities/doctors.entity';
import { DoctorsService } from '../services/doctors.service';

@Controller('doctors')
@UseGuards(AuthGuard('jwt'))
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async createDoctor(
    @Body() doctorDetails: CreateDoctorDto,
  ): Promise<DoctorsEntity> {
    return await this.doctorsService.createDoctor(doctorDetails);
  }

  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string): Promise<any> {
    return await this.doctorsService.getSchedule(id);
  }

  @Put(':id/schedule')
  async updateSchedule(
    @Param('id') id: string,
    @Body() schedule: DtoScheduleDay,
  ): Promise<IScheduleDay[]> {
    return await this.doctorsService.updateSchedule(id, schedule);
  }

  @Get()
  async getDoctors(): Promise<IUser[]> {
    return await this.doctorsService.getDoctors();
  }

  @Put(':id')
  async updateDoctor(
    @Param('id') id,
    @Body() userAndDoctorDetails: UpdateDoctorAndUserDto,
  ): Promise<TypeResponse | TypeResponseError> {
    return await this.doctorsService.updateDoctor(id, userAndDoctorDetails);
  }
}
