import {
  Body,
  Controller,
  Post,
  UseGuards,
  Put,
  Param,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IConsultation } from '../../shared/interfaces/consultations.interfaces';
import { RoleType } from '../../role/roletype.enum';
import { CancelConsultationDto } from '../dto/cancel-consultation.dto';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { RescheduleConsultationDto } from '../dto/reschedule-consultation.dto';
import { UpdateConsultationDto } from '../dto/update-consultation.dto';
import { ConsultationsEntity } from '../entities/consultations.entity';
import { ConsultationsService } from '../services/consultations.service';

@Controller('consultations')
@UseGuards(AuthGuard('jwt'))
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  async createConsultation(
    @Body() data: CreateConsultationDto,
  ): Promise<IConsultation> {
    return await this.consultationsService.createConsultation(data);
  }

  @Get('doctor/:id')
  async getConsultationsByDoctorId(
    @Param('id') id: string,
  ): Promise<IConsultation[]> {
    return await this.consultationsService.getConsultations(
      RoleType.DOCTOR,
      id,
    );
  }

  @Get('patient/:id')
  async getConsultationsByPatientId(
    @Param('id') id: string,
  ): Promise<IConsultation[]> {
    return await this.consultationsService.getConsultations(
      RoleType.PATIENT,
      id,
    );
  }

  @Put(':id')
  async updateConsultation(
    @Param('id') id: string,
    @Body() data: UpdateConsultationDto,
  ): Promise<ConsultationsEntity> {
    return await this.consultationsService.updateConsultation(id, data);
  }

  @Put(':id/cancel-doctor')
  async cancelConsultationDoctor(
    @Param('id') id: string,
    @Body() data: CancelConsultationDto,
  ): Promise<ConsultationsEntity> {
    return await this.consultationsService.cancelConsultation(
      id,
      data,
      RoleType.DOCTOR,
    );
  }

  @Put(':id/cancel-patient')
  async cancelConsultationPatient(
    @Param('id') id: string,
    @Body() data: CancelConsultationDto,
  ): Promise<ConsultationsEntity> {
    return await this.consultationsService.cancelConsultation(
      id,
      data,
      RoleType.PATIENT,
    );
  }

  @Put(':id/reschedule-doctor')
  async rescheduleConsultationDoctor(
    @Param('id') id: string,
    @Body() data: RescheduleConsultationDto,
  ): Promise<IConsultation> {
    return await this.consultationsService.rescheduleConsultation(
      id,
      data,
      RoleType.DOCTOR,
    );
  }

  @Put(':id/reschedule-patient')
  async rescheduleConsultationPatient(
    @Param('id') id: string,
    @Body() data: RescheduleConsultationDto,
  ): Promise<IConsultation> {
    return await this.consultationsService.rescheduleConsultation(
      id,
      data,
      RoleType.PATIENT,
    );
  }
}
