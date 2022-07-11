export interface IMedicalHistory {
  doctorId: string;
  createdAt: Date;
  history: string;
  files: { images: string[]; pdfs: string[] };
}
