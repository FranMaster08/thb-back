import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('doctors')
export class DoctorsEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  files: string; // TODO: hacer interfaces de estructura detallada de objeto .. YA ESTA HECHA

  @Column({ name: 'professional_backgroud' })
  professionalBackgroud: string; // TODO: hacer interfaces de estructura detallada de objeto.. YA ESTA HECHA

  @Column()
  specialty: string;

  @Column({ name: 'collegiate_number' })
  collegiateNumber: string;

  @Column({ name: 'consultation_rooms' })
  consultationRooms: string; // TODO: hacer interfaces de estructura detallada de objeto.. YA ESTA HECHA creo

  @Column({ name: 'insurance_companies' })
  insuranceCompanies: string; // TODO: hacer interfaces de estructura detallada de objeto,,  o lo recibe asi como string ? porque lle hace un JSON.strinfy.. YA ESTA HECHA

  @Column()
  schedule: string; // TODO: hacer interfaces de estructura detallada de objeto, enum para cada uno de los dias de la semana, ya hay en el front
  // TODO: cuando lo coloco como es: schedule: IScheduleDay[];    dice que no: Data type "Array" in "DoctorsEntity.schedule" is not supported by "mysql" database.
}
