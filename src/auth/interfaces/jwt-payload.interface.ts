import { GenderType } from 'src/users/enum/gender.enum';
import { UserStatusEnum } from 'src/users/enum/user-status.enum';

export interface JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatusEnum;
  role: string;
  dni: string;
  gender: GenderType;
  birthDate: Date;
  familyId: string;
}
