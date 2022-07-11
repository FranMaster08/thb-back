import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/createUsers.dto';
import { UsersEntity } from '../../users/entities/users.entity';
import { UsersService } from '../../users/services/users.service';
import { LoginCredentialsDto } from '../dto/LoginCredentialsDto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserStatusEnum } from '../../users/enum/user-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { RecoveryPassByEmailDto } from '../dto/RecoveryPassByEmailDto';
import { NotifyService } from '../../notify/services/notify.service';
import {
  TypeResponse,
  TypeResponseError,
} from '../../shared/types/response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // @Inject(forwardRef(() => NotifyService))
    private readonly notifyService: NotifyService,
  ) {}

  async signup(user: CreateUserDto): Promise<UsersEntity> {
    return this.usersService.createUser(user);
  }

  async login(credentials: LoginCredentialsDto): Promise<any> {
    const user = await this.usersService.findOne({
      where: { email: credentials.username },
    });

    if (!user || user.status !== UserStatusEnum.ACTIVE) {
      throw new ConflictException('Invalid credentials');
    }

    let loginValid = false;

    loginValid = await this.usersService.validatePassword(
      credentials.password,
      user.password,
    );

    if (!loginValid) {
      throw new ConflictException('Invalid credentials');
    }

    return await this.generateJWT(user);
  }

  async generateJWT(user: UsersEntity): Promise<any> {
    const jwtPayload: JwtPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      role: user.role,
      dni: user.dni,
      gender: user.gender,
      birthDate: user.birthDate,
      familyId: user.familyId,
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      issuer: 'editor', // FIXME: agregar en config auth
      expiresIn: '1day', // FIXME: agregar en config auth
    });

    return {
      token: accessToken,
      expiresIn: '1day', // FIXME: agregar en config auth
      payload: jwtPayload,
    };
  }

  async recoveryPasswordSendEmail(email: string) {
    const user = await this.usersService.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tokenPasswordRecovery = uuidv4();

    const reponseUTPR = await this.usersService.updateTokenPasswordRecovery(
      user.id,
      tokenPasswordRecovery,
    );

    if (reponseUTPR) {
      const sendMail = await this.notifyService.notifyRecoveryPasswordSendEmail(
        {
          user: {
            id: user.id,
            email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          tokenPasswordRecovery: tokenPasswordRecovery,
        },
      );
      if (sendMail) {
        return {
          statusCode: 1,
          message: 'Email sent',
          user: {
            firstName: user.firstName,
            email: user.email,
          },
        };
      } else {
        return {
          statusCode: 0,
          message: 'Email has not been sent',
          error: 'Not Built',
        };
      }
    }

    return {
      statusCode: 0,
      message: 'Token has not been built',
      error: 'Not Built',
    };
  }

  async recoveryPasswordByEmail(
    recovery: RecoveryPassByEmailDto,
  ): Promise<TypeResponse | TypeResponseError> {
    const user = await this.usersService.findOne({
      where: {
        id: recovery.userId,
        email: recovery.email,
        tokenPasswordRecovery: recovery.tokenPasswordRecovery,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found or token is expired');
    }

    const updateResult = await this.usersService.update(
      {
        id: recovery.userId,
        email: recovery.email,
        tokenPasswordRecovery: recovery.tokenPasswordRecovery,
      },
      {
        password: await this.usersService.hashPassword(recovery.password),
        tokenPasswordRecovery: null,
      },
    );

    if (updateResult) {
      return {
        statusCode: 1,
        message: 'Password has been reset',
        user: { firstName: user.firstName },
      };
    } else {
      return {
        statusCode: 0,
        error: 'Not updated',
        message: 'Password has not been reset',
      };
    }

    // TODO: creo que el token deveria tener un vencimiento de una hora o algo asi,
    // en la base de datos { token: xxx, expiresIn: "1hour" } ... expiresIn, date now, + 1 hour, y despues comparar
    // verificar en la pagina de front,, y decir si ha espirado o no el token,, esta opcion ha expidaro
    // o pasar un cron diario que setee a null todos los token_password_recovery
  }
}
