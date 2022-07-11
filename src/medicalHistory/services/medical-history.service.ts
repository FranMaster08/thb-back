import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMedicalHistoryDto } from '../dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from '../dto/update-medical-history.dto';
import { MedicalHistoryEntity } from '../entities/medical-history.entity';

@Injectable()
export class MedicalHistoryService {
  constructor(
    @InjectRepository(MedicalHistoryEntity, 'thv-db')
    private readonly medicalHistoryRepository: Repository<MedicalHistoryEntity>,
  ) {}

  async createMedicalHistory(
    data: CreateMedicalHistoryDto,
  ): Promise<MedicalHistoryEntity> {
    // if (
    //   await this.medicalHistoryRepository.findOne({
    //     where: {
    //       patientId: data.patientId,
    //       doctorId: data.doctorId,
    //     },
    //   })
    // ) {
    //   throw new ConflictException(
    //     'There is already a medical history of this patient with this doctor.',
    //   );
    // }

    const newMedicalHistory = new MedicalHistoryEntity();
    newMedicalHistory.doctorId = data.doctorId;
    newMedicalHistory.patientId = data.patientId;
    newMedicalHistory.history = JSON.stringify(data.history);

    return this.medicalHistoryRepository.save(newMedicalHistory);
  }

  async updateMedicalHistory(
    id: string,
    data: UpdateMedicalHistoryDto,
  ): Promise<MedicalHistoryEntity> {
    if (!(await this.medicalHistoryRepository.findOne(id))) {
      throw new NotFoundException('Medical history not found');
    }

    await this.medicalHistoryRepository.update(
      {
        id: id,
      },
      {
        history: JSON.stringify(data.history),
      },
    );

    return await this.medicalHistoryRepository.findOne(id);
  }
}
