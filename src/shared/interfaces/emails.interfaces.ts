import { GenderType } from '../../users/enum/gender.enum';

export interface IEmailConsultationAttended {
  id: string;
  date: string;
  patient: {
    firstName: string;
    lastName: string;
  };
  doctor: {
    firstName: string;
    lastName: string;
    gender: GenderType;
  };
}

export interface IEmailRecoveryPassword {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
  };
  tokenPasswordRecovery: string;
}
