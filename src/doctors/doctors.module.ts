import { Module } from '@nestjs/common';
import { DoctorsService } from './services/doctors.service';
import { DoctorsController } from './controllers/doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsEntity } from './entities/doctors.entity';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity], 'thv-db'),
    TypeOrmModule.forFeature([DoctorsEntity], 'thv-db'),
    UsersModule
  ],
  providers: [DoctorsService],
  controllers: [DoctorsController],
})
export class DoctorsModule {}
