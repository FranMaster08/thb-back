import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyService } from '../notify/services/notify.service';
import { ConsultationsModule } from '../consultations/consultations.module';
import { FilesController } from './controllers/files.controller';
import { FilesEntity } from './entities/files.entity';
import { FilesService } from './services/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilesEntity], 'thv-db'),
    forwardRef(() => ConsultationsModule),
  ],
  controllers: [FilesController],
  providers: [FilesService, NotifyService],
  exports: [FilesService],
})
export class FilesModule {}
