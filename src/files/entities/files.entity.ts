import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileContext } from '../enum/files.enum';

@Entity('files')
export class FilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @Column({
    type: 'enum',
    enum: FileContext,
    default: FileContext.CONSULTATION,
  })
  context: FileContext;

  @Column({ name: 'consultation_id' })
  consultationId: string;

  @Column({ name: 'medical_history_id' })
  medicalHistoryId: string;

  @Column()
  files: string; // es un [] pero dice un error que Array no es soportado en database typeorm

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
