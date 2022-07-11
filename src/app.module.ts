import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { ConfigModule } from './config/config.module';
// import { ConfigService } from './config/config.service';
// import { Configuration } from './config/config.keys';
import { UsersModule } from './users/users.module';
import { UsersEntity } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { DoctorsEntity } from './doctors/entities/doctors.entity';
import { ConsultationsModule } from './consultations/consultations.module';
import { ConsultationsEntity } from './consultations/entities/consultations.entity';
import { MedicalHistoryEntity } from './medicalHistory/entities/medical-history.entity';
import { MedicalHistoryModule } from './medicalHistory/medical-history.module';
import { PatientsModule } from './patients/patients.module';
import { FilesModule } from './files/files.module';
import { FilesEntity } from './files/entities/files.entity';
import { NotifyModule } from './notify/notity.module';
import { InventoryModule } from './inventory/inventory.module';
import { InventoryEntity } from './inventory/entities/inventory.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      name: 'thv-db',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      timezone: process.env.DB_TYPEORM_TIMEZONE,
      entities: [
        UsersEntity,
        DoctorsEntity,
        ConsultationsEntity,
        MedicalHistoryEntity,
        FilesEntity,
        InventoryEntity,
      ],
    }),
    // ConfigModule,
    UsersModule,
    AuthModule,
    DoctorsModule,
    ConsultationsModule,
    MedicalHistoryModule,
    PatientsModule,
    FilesModule,
    NotifyModule,
    InventoryModule,
  ],
})
export class AppModule {}
