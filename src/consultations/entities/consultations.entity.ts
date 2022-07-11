import { UsersEntity } from '../../users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConsultationsStatus } from '../enum/consultations-status.enum';
import { ConsultationsType } from '../enum/consultations-type.enum';
import { DoctorsEntity } from '../../doctors/entities/doctors.entity';

@Entity('consultations')
export class ConsultationsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({
    type: 'enum',
    enum: ConsultationsStatus,
    default: ConsultationsStatus.PENDING,
  })
  status: ConsultationsStatus;

  @Column({
    type: 'enum',
    enum: ConsultationsType,
  })
  type: ConsultationsType;

  @Column({ name: 'family_id' })
  familyId: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ name: 'place' })
  place: string;

  @Column()
  observations: string;

  @Column()
  prescriptions: string;

  @Column()
  exams: string;

  @Column()
  quote: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, { cascade: false, nullable: false })
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'id' })
  patient: UsersEntity;

  @ManyToOne(() => UsersEntity, { cascade: false, nullable: false })
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' })
  doctor: UsersEntity;

  @ManyToOne(() => DoctorsEntity, { cascade: false, nullable: false })
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' })
  doctorDetail: DoctorsEntity;
}
