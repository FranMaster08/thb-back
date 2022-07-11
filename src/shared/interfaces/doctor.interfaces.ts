import { Day } from '../enum/day.enum';

export interface IFiles {
  profile_picture: string;
}

export interface IProfessionalBackgroud {
  experience: string[];
  academic_studies: string[];
}

export interface IScheduleDay {
  day: Day;
  from: string;
  until: string;
  numberConsultations: number;
}
