import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IScheduleDay } from '../../shared/interfaces/doctor.interfaces';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { DtoScheduleDay } from '../dto/schedule-day.dto';
import { DoctorsEntity } from '../entities/doctors.entity';
import { IUser } from '../../shared/interfaces/users.interfaces';
import { GenderType } from '../../users/enum/gender.enum';
import { UsersEntity } from '../../users/entities/users.entity';
import { RoleType } from '../../role/roletype.enum';
import { UsersService } from '../../users/services/users.service';
import { UpdateDoctorAndUserDto } from '../dto/update-doctor-and-user.dto';
import {
  TypeResponse,
  TypeResponseError,
} from '../../shared/types/response.type';

@Injectable()
export class DoctorsService {
  logger = new Logger();

  constructor(
    @InjectRepository(DoctorsEntity, 'thv-db')
    private readonly doctorsRepository: Repository<DoctorsEntity>,
    @InjectRepository(UsersEntity, 'thv-db')
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly usersService: UsersService,
  ) {}

  async createDoctor(doctorDetails: CreateDoctorDto): Promise<DoctorsEntity> {
    // TODO: antes de crear un doctor, verificar si existe como usuario... pues el mismo id del user es el del doctor

    const exist = await this.doctorsRepository.count({ id: doctorDetails.id });

    if (exist) {
      throw new ConflictException('Config doctor id already exists');
    }

    let newDoctor = new DoctorsEntity();
    newDoctor.id = doctorDetails.id;
    newDoctor.files = JSON.stringify(doctorDetails.files);
    newDoctor.professionalBackgroud = JSON.stringify(
      doctorDetails.professionalBackgroud,
    );
    newDoctor.specialty = doctorDetails.specialty;
    newDoctor.collegiateNumber = doctorDetails.collegiateNumber;
    newDoctor.consultationRooms = JSON.stringify(
      doctorDetails.consultationRooms,
    );
    newDoctor.insuranceCompanies = JSON.stringify(
      doctorDetails.insuranceCompanies,
    );
    newDoctor.schedule = JSON.stringify(doctorDetails.schedule);

    const saveDoctor = await this.doctorsRepository.save(newDoctor);

    return saveDoctor;
  }

  async getSchedule(id: string) {
    const doctor = await this.doctorsRepository.findOne(id);

    if (!doctor) {
      throw new NotFoundException('Doctor does not exist');
    }

    return JSON.parse(doctor.schedule);
  }

  async updateSchedule(id: string, schedule: DtoScheduleDay) {
    const doctor = await this.doctorsRepository.findOne(id);

    if (!doctor) {
      throw new NotFoundException('Doctor does not exist');
    }

    const doctorSchedule: IScheduleDay[] = JSON.parse(doctor.schedule).map(
      (schedule_) => {
        if (schedule_.day === schedule.day) {
          return schedule;
        }
        return schedule_;
      },
    );

    await this.doctorsRepository.update(id, {
      schedule: JSON.stringify(doctorSchedule),
    });

    return doctorSchedule;
  }

  async getDoctors(): Promise<IUser[]> {
    const find = await this.usersRepository.find({
      where: { role: RoleType.DOCTOR },
      relations: ['doctorDetail'],
      order: { firstName: 'ASC' },
    });

    const doctors: IUser[] = find.map((user) => {
      let gender = GenderType.MALE;
      if (user.gender === GenderType.FELAME) {
        gender = GenderType.FELAME;
      }
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dni: user.dni,
        status: user.status,
        birthDate: user.birthDate,
        gender,
        medicalCenterId: user.medicalCenterId,
        doctorDetail: {
          id: user.doctorDetail.id,
          files: JSON.parse(user.doctorDetail.files),
          professionalBackgroud: JSON.parse(
            user.doctorDetail.professionalBackgroud,
          ),
          specialty: user.doctorDetail.specialty,
          collegiateNumber: user.doctorDetail.collegiateNumber,
          consultationRooms: JSON.parse(user.doctorDetail.consultationRooms),
          insuranceCompanies: JSON.parse(user.doctorDetail.insuranceCompanies),
          schedule: user.doctorDetail.schedule,
        },
      };
    });
    return doctors;
  }

  async updateDoctor(
    id: string,
    userAndDoctorDetails: UpdateDoctorAndUserDto,
  ): Promise<TypeResponse | TypeResponseError> {
    const context = `${DoctorsService.name} | ${this.updateDoctor.name}`;
    this.logger.log(
      `userAndDoctorDetails: ${JSON.stringify(userAndDoctorDetails)}`,
      `${context} | BEGIN`,
    );

    if (!(await this.doctorsRepository.count({ id }))) {
      throw new ConflictException('Config doctor not found');
    }

    const updateDoctorDetailData = {
      specialty: userAndDoctorDetails.doctorDetail.specialty,
      collegiateNumber: userAndDoctorDetails.doctorDetail.collegiateNumber,
      consultationRooms: JSON.stringify(
        userAndDoctorDetails.doctorDetail.consultationRooms,
      ),
    };

    const updateDoctorDetail = await this.doctorsRepository.update(
      id,
      updateDoctorDetailData,
    );

    const updateUserData = {
      medicalCenterId: userAndDoctorDetails.user.medicalCenterId,
      firstName: userAndDoctorDetails.user.firstName,
      lastName: userAndDoctorDetails.user.lastName,
      gender: userAndDoctorDetails.user.gender,
      birthDate: userAndDoctorDetails.user.birthDate,
      email: userAndDoctorDetails.user.email,
      dni: userAndDoctorDetails.user.dni,
    };

    const updateUser = await this.usersService.update({ id }, updateUserData);

    let resultUser = false;
    let resultDoctor = false;
    let message = '';

    if (updateUser) {
      this.logger.log(`User has been updated`, context);
      resultUser = true;
    } else {
      this.logger.log(`User has not been updated`, context);
    }

    if (updateDoctorDetail.affected) {
      this.logger.log(`Doctor detail has been updated`, context);
      resultDoctor = true;
    } else {
      this.logger.log(`Doctor detail has not been updated`, context);
    }

    if (resultUser) {
      message += 'Step 1: User has been updated. ';
    }
    if (resultDoctor) {
      message += 'Step 2: Doctor detail has been updated. ';
    }

    if (resultUser || resultDoctor) {
      return {
        statusCode: 1,
        message,
        data: {
          id,
          ...updateUserData,
          ...updateDoctorDetailData,
        },
      };
    } else {
      return {
        statusCode: 0,
        error: 'Not updated',
        message: 'Doctor has not been updated',
      };
    }
  }
}
