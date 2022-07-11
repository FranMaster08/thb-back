import { Module } from '@nestjs/common';
import { PatientsService } from './services/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users/entities/users.entity';
import { MedicalHistoryEntity } from '../medicalHistory/entities/medical-history.entity';
import { FilesEntity } from 'src/files/entities/files.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity], 'thv-db'),
    TypeOrmModule.forFeature([MedicalHistoryEntity], 'thv-db'),
    TypeOrmModule.forFeature([FilesEntity], 'thv-db'),
  ],
  providers: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}
