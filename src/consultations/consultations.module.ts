import { forwardRef, Module } from '@nestjs/common';
import { ConsultationsService } from './services/consultations.service';
import { ConsultationsController } from './controllers/consultations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationsEntity } from './entities/consultations.entity';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultationsEntity], 'thv-db'),
    forwardRef(() => FilesModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ConsultationsService],
  controllers: [ConsultationsController],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
