import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './services/medical-history.service';
import { MedicalHistoryController } from './controllers/medical-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalHistoryEntity } from './entities/medical-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalHistoryEntity], 'thv-db')],
  providers: [MedicalHistoryService],
  controllers: [MedicalHistoryController],
})
export class MedicalHistoryModule {}
