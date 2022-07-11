import { FileContext, FileExtension } from '../../files/enum/files.enum';

export interface IUrlFiles {
  name: string;
  url: string;
}

export interface IFile {
  extension: FileExtension;
  base64: string;
}

export interface IFilesDB {
  patientId: string;
  doctorId: string;
  context: FileContext;
  consultationId: string;
  medicalHistoryId: string;
  files: string[];
}
