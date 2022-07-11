import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { CreateUserDto } from '../dto/createUsers.dto';
import { compare, hash } from 'bcryptjs';
import { IUser } from '../../shared/interfaces/users.interfaces';

@Injectable()
export class UsersService {
  logger = new Logger();

  constructor(
    @InjectRepository(UsersEntity, 'thv-db')
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async createUser(user: CreateUserDto) {
    const exist = await this.usersRepository.count({ email: user.email });
    if (exist) {
      throw new ConflictException('User already exists');
    }

    const nuevoUsuario = new UsersEntity();
    nuevoUsuario.firstName = user.firstName;
    nuevoUsuario.lastName = user.lastName;
    nuevoUsuario.email = user.email;
    nuevoUsuario.dni = user.dni;
    nuevoUsuario.gender = user.gender;
    nuevoUsuario.role = user.role;
    nuevoUsuario.birthDate = user.birthDate;
    nuevoUsuario.password = await this.hashPassword(user.password);
    nuevoUsuario.familyId = user.familyId;
    nuevoUsuario.medicalCenterId = user.medicalCenterId;

    const userCreate = await this.usersRepository.create(nuevoUsuario);
    const userSave = await this.usersRepository.save(userCreate);

    // TODO: enviar email

    let createdUser = await this.usersRepository.findOne(userSave.id, {});

    return createdUser;
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, 8); // FIXME: pasar el saltLength (8) a /config/auth.ts
  }

  async validatePassword(
    canditatePassword: string,
    password: string,
  ): Promise<boolean> {
    return await compare(canditatePassword, password);
  }

  async updateTokenPasswordRecovery(
    id: string,
    tokenPasswordRecovery: string,
  ): Promise<number> {
    const update = await this.usersRepository.update(id, {
      tokenPasswordRecovery,
    });
    if (update.affected) {
      return 1;
    } else {
      return 0;
    }
  }

  async findOne(config: { where: IUser }): Promise<UsersEntity> {
    const context = `${UsersService.name} | ${this.findOne.name}`;
    this.logger.log(`config: ${JSON.stringify(config)}`, `${context} | BEGIN`);
    const { where } = config;
    return await this.usersRepository.findOne({ where });
  }

  async findFamilyIdsByPatientId(patientId): Promise<string[]> {
    const find = await this.usersRepository.find({ familyId: patientId });
    return find.map((user) => user.id);
  }

  async update(where: IUser, setParams: IUser): Promise<number> {
    const updateResult = await this.usersRepository.update(where, setParams);
    return updateResult.affected ? 1 : 0;
  }
}
