import {
  Body,
  Controller,
  Post,
  UseGuards,
  Logger,
  Put,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateMedicalHistoryDto } from '../dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from '../dto/update-medical-history.dto';
import { MedicalHistoryEntity } from '../entities/medical-history.entity';
import { MedicalHistoryService } from '../services/medical-history.service';

@Controller('medical-history')
@UseGuards(AuthGuard('jwt'))
export class MedicalHistoryController {
  logger = new Logger('MedicalHistoryController');

  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @Post()
  async createMedicalHistory(
    @Body() data: CreateMedicalHistoryDto,
  ): Promise<MedicalHistoryEntity> {
    this.logger.log('[createMedicalHistory] ' + JSON.stringify(data));

    return await this.medicalHistoryService.createMedicalHistory(data);
  }

  @Put(':id')
  async updateMedicalHistory(
    @Param('id') id: string,
    @Body() data: UpdateMedicalHistoryDto,
  ): Promise<MedicalHistoryEntity> {
    this.logger.log('[updateMedicalHistory] ' + id);

    return await this.medicalHistoryService.updateMedicalHistory(id, data);
  }
}
