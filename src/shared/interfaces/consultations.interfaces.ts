import { ConsultationsStatus } from '../../consultations/enum/consultations-status.enum';
import { ConsultationsType } from '../../consultations/enum/consultations-type.enum';
import { IPatient } from './patients.interfaces';

export interface IQuote {
  service: string;
  cost: number;
}

export interface IConsultation {
  id: string;
  status: ConsultationsStatus;
  type: ConsultationsType;
  date: Date;
  place: string;
  observations: string;
  prescriptions: string;
  exams: string;
  quote: string;
  patient: IPatient;
  doctor?: IPatient;
}
