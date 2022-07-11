import { RoleType } from '../../role/roletype.enum';
import { GenderType } from '../../users/enum/gender.enum';
import { UserStatusEnum } from '../../users/enum/user-status.enum';

export interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dni?: string;
  password?: string;
  status?: UserStatusEnum;
  birthDate?: Date;
  gender?: GenderType;
  role?: RoleType;
  tokenPasswordRecovery?: string;
  familyId?: string;
  medicalCenterId?: string;
}
