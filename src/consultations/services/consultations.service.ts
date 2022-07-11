import {
  Injectable,
  NotFoundException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from '../../role/roletype.enum';
import { In, Repository } from 'typeorm';
// import * as moment from 'moment';
import { CancelConsultationDto } from '../dto/cancel-consultation.dto';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { RescheduleConsultationDto } from '../dto/reschedule-consultation.dto';
import { UpdateConsultationDto } from '../dto/update-consultation.dto';
import { ConsultationsEntity } from '../entities/consultations.entity';
import { ConsultationsStatus } from '../enum/consultations-status.enum';
import { IConsultation } from '../../shared/interfaces/consultations.interfaces';
import { FilesService } from '../../files/services/files.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class ConsultationsService {
  logger = new Logger(ConsultationsService.name);

  constructor(
    @InjectRepository(ConsultationsEntity, 'thv-db')
    private readonly consultationsRepository: Repository<ConsultationsEntity>,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
    // @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async createConsultation(
    data: CreateConsultationDto,
  ): Promise<ConsultationsEntity> {
    // TODO: verificar si el doctor existe
    // TODO: verificar si el paciente existe

    this.logger.log('BEGIN [createConsultation] ' + JSON.stringify(data));

    const newConsultation = new ConsultationsEntity();
    newConsultation.doctorId = data.doctorId;
    newConsultation.patientId = data.patientId;
    newConsultation.status = data.status;
    newConsultation.type = data.type;
    newConsultation.familyId = data.familyId;
    newConsultation.date = data.date;
    newConsultation.place = data.place;
    newConsultation.observations = JSON.stringify(data.observations);
    newConsultation.prescriptions = JSON.stringify(data.prescriptions);
    newConsultation.exams = JSON.stringify(data.exams);
    newConsultation.quote = JSON.stringify(data.quote);

    const saveConsultation = await this.consultationsRepository.save(
      newConsultation,
    );
    const getConsultation = await this.consultationsRepository.findOne(
      saveConsultation.id,
      { relations: ['patient'] },
    );

    getConsultation.observations = JSON.parse(getConsultation.observations);

    return getConsultation;

    // TODO: enviar mail con la agenda de la consulta
    // TODO: verificar si hay una consulta para esa misma fecha y horario
    // TODO: verificar si el paciente tiene 2 consultas por atender, solo puede tener 2 por atender
  }

  async getConsultations(role: RoleType, id: string): Promise<IConsultation[]> {
    this.logger.log(role + ' ' + id);
    let consultations: IConsultation[];
    if (role === RoleType.DOCTOR) {
      consultations = await this.consultationsRepository.find({
        select: [
          'id',
          'date',
          'status',
          'type',
          'place',
          'observations',
          'prescriptions',
          'exams',
          'quote',
        ],
        where: { doctorId: id },
        relations: ['patient'],
        order: { date: 'ASC' },
      });

      consultations = consultations.map((consultation) => ({
        id: consultation.id,
        status: consultation.status,
        type: consultation.type,
        date: consultation.date,
        place: consultation.place,
        observations: JSON.parse(consultation.observations),
        prescriptions: JSON.parse(consultation.prescriptions),
        exams: JSON.parse(consultation.exams),
        quote: JSON.parse(consultation.quote),
        patient: consultation.patient,
      }));
    } else if (role === RoleType.PATIENT) {
      const familyIds = await this.usersService.findFamilyIdsByPatientId(id);

      consultations = await this.consultationsRepository.find({
        select: [
          'id',
          'date',
          'status',
          'type',
          'place',
          'observations',
          'prescriptions',
          'exams',
          'quote',
        ],
        where: {
          patientId: In([id, ...familyIds]),
        },
        relations: ['patient', 'doctor'],
        order: { date: 'ASC' },
      });

      consultations = consultations.map((consultation) => ({
        id: consultation.id,
        status: consultation.status,
        type: consultation.type,
        date: consultation.date,
        place: consultation.place,
        observations: JSON.parse(consultation.observations),
        prescriptions: JSON.parse(consultation.prescriptions),
        exams: JSON.parse(consultation.exams),
        quote: JSON.parse(consultation.quote),
        patient: consultation.patient,
        doctor: consultation.doctor,
      }));
    } else if (role === RoleType.ADMIN) {
      consultations = await this.consultationsRepository.find();
    }

    return consultations;
  }

  async updateConsultation(
    id: string,
    data: UpdateConsultationDto,
  ): Promise<ConsultationsEntity> {
    this.logger.log(
      `BEGIN [${this.updateConsultation.name}] Params[id: string = ${id}]`,
    );

    if (!(await this.consultationsRepository.findOne(id))) {
      throw new NotFoundException('Medical consultation not found');
    }

    await this.consultationsRepository.update(id, {
      status: ConsultationsStatus.ATTENDED,
      observations: JSON.stringify(data.observations),
      prescriptions: JSON.stringify(data.prescriptions),
      exams: JSON.stringify(data.exams),
      quote: JSON.stringify(data.quote),
    });

    // create pdf and send mail
    this.filesService.buildReportByConsultationId(id);

    return await this.consultationsRepository.findOne(id);
  }

  async cancelConsultation(
    id: string,
    data: CancelConsultationDto,
    userRol: RoleType.PATIENT | RoleType.DOCTOR,
  ): Promise<ConsultationsEntity> {
    this.logger.log(
      `BEGIN [${this.cancelConsultation.name}] Params[id: string = ${id}]`,
    );

    if (!(await this.consultationsRepository.findOne(id))) {
      throw new NotFoundException('Medical consultation not found');
    }

    let status = ConsultationsStatus.CANCELLED_ADMIN;
    if (userRol === RoleType.PATIENT) {
      status = ConsultationsStatus.CANCELLED_PATIENT;
    } else if (userRol === RoleType.DOCTOR) {
      status = ConsultationsStatus.CANCELLED_DOCTOR;
    }

    await this.consultationsRepository.update(id, {
      status,
      observations: JSON.stringify(data.observations),
    });

    const find = await this.consultationsRepository.findOne(id);
    find.observations = JSON.parse(find.observations);

    return find;

    // TODO: se envia email informando la cancelacion
  }

  async rescheduleConsultation(
    id: string,
    data: RescheduleConsultationDto,
    userRol: RoleType.PATIENT | RoleType.DOCTOR,
  ): Promise<IConsultation> {
    this.logger.log(
      `BEGIN [${this.rescheduleConsultation.name}] Params[id: string = ${id}]`,
    );

    if (!(await this.consultationsRepository.findOne(id))) {
      throw new NotFoundException('Medical consultation not found');
    }

    await this.consultationsRepository.update(id, {
      date: data.date,
      status: ConsultationsStatus.PENDING,
      observations: JSON.stringify(data.observations),
    });

    const find = await this.consultationsRepository.findOne(id);
    find.observations = JSON.parse(find.observations);

    return find;

    // TODO: se envia email cinformando la reagenda
  }

  async findOne(id: string): Promise<ConsultationsEntity> {
    const consultation = await this.consultationsRepository.findOne(id, {
      relations: ['patient', 'doctor', 'doctorDetail'],
    });
    if (!consultation) {
      throw new NotFoundException('Medical consultation not found');
    }
    return consultation;
  }
}
