import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as htmlPDF from 'html-pdf';
import * as moment from 'moment';
import 'moment/locale/es';
import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFilesDto } from '../dto/CreateFilesDto';
import { FilesEntity } from '../entities/files.entity';
import { IFilesDB, IUrlFiles } from '../../shared/interfaces/files.interfaces';
import { IQuote } from '../../shared/interfaces/consultations.interfaces';
import { ConsultationsService } from '../../consultations/services/consultations.service';
import { FileContext, FileExtension } from '../enum/files.enum';
import { GenderType } from '../../users/enum/gender.enum';
import { ConsultationsStatus } from '../../consultations/enum/consultations-status.enum';
import { NotifyService } from '../../notify/services/notify.service';

@Injectable()
export class FilesService {
  logger = new Logger();

  constructor(
    @InjectRepository(FilesEntity, 'thv-db')
    private readonly filesRepository: Repository<FilesEntity>,
    @Inject(forwardRef(() => ConsultationsService))
    private readonly consultationsServive: ConsultationsService,
    private readonly notifyService: NotifyService,
  ) {}

  async uploadFilesToDirectory(files: CreateFilesDto) {
    this.logger.log(
      `Cargando files`,
      `${FilesService.name} | ${this.uploadFilesToDirectory.name} | BEGIN `,
    );
    const FILES_URL = process.env.FILES_URL;

    try {
      const urlFiles: IUrlFiles[] = [];

      files.files.forEach((file) => {
        const base64Img = file.base64;
        const fileName = `${uuidv4()}.${file.extension}`;
        const content = Buffer.from(base64Img, 'base64');

        if (files.context === FileContext.CONSULTATION) {
          fs.writeFileSync(
            `./public/consultations/attachments/${fileName}`,
            content,
          );
        } else if (files.context === FileContext.MEDICAL_HISTORY) {
          fs.writeFileSync(
            `./public/medicalHistories/attachments/${fileName}`,
            content,
          );
        }

        urlFiles.push({
          name: fileName,
          url: `${FILES_URL}/${fileName}`,
        });

        this.logger.log(
          `Upload file ${fileName}`,
          `${FilesService.name} | ${this.uploadFilesToDirectory.name}`,
        );
      });

      this.logger.log(
        `Upload files END`,
        `${FilesService.name} | ${this.uploadFilesToDirectory.name}`,
      );

      const filesDB: string[] = urlFiles.map((file) => file.name);
      const saveFiles = await this.saveFiles({ ...files, files: filesDB });

      let attachedFiles: { images: string[]; pdfs: string[] } = {
        images: [],
        pdfs: [],
      };
      if (saveFiles) {
        JSON.parse(saveFiles.files).forEach((attached: string) => {
          if (attached.includes(FileExtension.PDF)) {
            attachedFiles.pdfs.push(attached);
          } else if (
            attached.includes(FileExtension.PNG) ||
            attached.includes(FileExtension.JPEG)
          ) {
            attachedFiles.images.push(attached);
          }
        });
      }

      return {
        ...saveFiles,
        files: attachedFiles,
      };
    } catch (error) {
      this.logger.error(
        `Error[${error.message}]`,
        error,
        `${FilesService.name} | ${this.uploadFilesToDirectory.name}`,
      );
      throw new ConflictException('Error loading file');
    }
  }

  private async saveFiles(files: IFilesDB): Promise<FilesEntity> {
    // TODO: verificar si existe doctor
    // TODO: verificar si existe pati
    // TODO: verificar si existe consultation

    let newFiles = new FilesEntity();
    newFiles.patientId = files.patientId;
    newFiles.doctorId = files.doctorId;
    newFiles.context = files.context;
    newFiles.consultationId = files.consultationId;
    newFiles.medicalHistoryId = files.medicalHistoryId;
    newFiles.files = JSON.stringify(files.files);

    const saveFiles = await this.filesRepository.save(newFiles);

    this.logger.log(
      `Return[${JSON.stringify(saveFiles)}]`,
      `${FilesService.name} | ${this.saveFiles.name}`,
    );
    return saveFiles;
  }

  async getAttachedFilesByContextId(id: string, context: FileContext) {
    let findAttachedFiles: FilesEntity = null;

    if (context === FileContext.CONSULTATION) {
      findAttachedFiles = await this.filesRepository.findOne({
        where: { consultationId: id },
      });
    } else if (context === FileContext.MEDICAL_HISTORY) {
      findAttachedFiles = await this.filesRepository.findOne({
        where: { medicalHistoryId: id },
      });
    } else {
      return {
        images: [],
        pdfs: [],
      };
    }

    if (!findAttachedFiles) {
      // throw new NotFoundException('Files Consultation not found');
      return {
        images: [],
        pdfs: [],
      };
    }

    const attachedFiles: { images: string[]; pdfs: string[] } = {
      images: [],
      pdfs: [],
    };

    JSON.parse(findAttachedFiles.files).forEach((attached: string) => {
      if (attached.includes(FileExtension.PDF)) {
        attachedFiles.pdfs.push(attached);
      } else if (
        attached.includes(FileExtension.PNG) ||
        attached.includes(FileExtension.JPEG)
      ) {
        attachedFiles.images.push(attached);
      }
      // return attached;
    });

    return attachedFiles;
  }

  async buildReportByConsultationId(consultationId: string, res?: any) {
    this.logger.log(
      `Params[consultationId: string = ${consultationId}, res: @Res]`,
      `${FilesService.name} | ${this.buildReportByConsultationId.name} | BEGIN`,
    );

    const consultation = await this.consultationsServive.findOne(
      consultationId,
    );

    let html = fs.readFileSync(
      './public/emails/medical-report/medical-report.pdf.html',
      'utf8',
    );

    // PATIENT
    if (consultation.patient.dni) {
      html = html.replace('{{patientDni}}', consultation.patient.dni);
    } else {
      html = html.replace('{{patientDni}}', 'No indicó');
    }

    html = html.replace(
      '{{patientName}}',
      `${consultation.patient.firstName} ${consultation.patient.lastName}`,
    );
    html = html.replace(
      '{{patientGender}}',
      consultation.patient.gender === GenderType.FELAME
        ? 'Femenino'
        : 'Masculino',
    );
    html = html.replace(
      '{{patientBirthDate}}',
      moment(consultation.patient.birthDate)
        .utc(false)
        .format('D [de] MMMM [del] YYYY'),
    );

    // DOCTOR
    html = html.replace(
      '{{doctorName}}',
      `${consultation.doctor.firstName} ${consultation.doctor.lastName}`,
    );
    html = html.replace(
      '{{doctorCollegiateNumber}}',
      consultation.doctorDetail.collegiateNumber,
    );
    html = html.replace(
      '{{doctorSpecialty}}',
      consultation.doctorDetail.specialty,
    );

    // CONSULTATION
    html = html.replace(
      '{{consultationDate}}',
      moment(consultation.date).utc(false).format('D [de] MMMM [del] YYYY'),
    );

    if (consultation.status === ConsultationsStatus.ATTENDED) {
      const observations: string[] = JSON.parse(consultation.observations);

      if (observations.length === 0) {
        html = html.replace('{{consultationDiagnosis}}', 'No indicó');
      } else if (observations.length === 2) {
        html = html.replace(
          '{{consultationDiagnosis}}',
          `
          <div style="font-weight: bold">CIE-10</div>
          <div style="padding: 5 0 0 10">
            ${observations[0]}
          </div>
          <hr />
          <strong>Observaciones</strong>
          <div style="padding: 5 0 0 10">
          ${observations[1]}
          </div>
          `,
        );
      } else if (observations.length === 1) {
        html = html.replace(
          '{{consultationDiagnosis}}',
          `
          <strong>Observaciones</strong>
          <div style="padding: 5 0 0 10">
          ${observations[0]}
          </div>
          `,
        );
      }

      const prescriptions: string[] = JSON.parse(consultation.prescriptions);
      if (prescriptions.length > 0) {
        let prescriptionsHTML = '';
        prescriptions.forEach((prescription) => {
          prescriptionsHTML += `<div>${prescription}</div><hr />`;
        });
        html = html.replace(
          '{{consultationPrescription}}',
          prescriptionsHTML.slice(0, prescriptionsHTML.length - 6),
        );
      } else {
        html = html.replace('{{consultationPrescription}}', 'No indicó');
      }

      const exams: string[] = JSON.parse(consultation.exams);
      if (exams.length > 0) {
        let examsHTML = '';
        exams.forEach((exam) => {
          examsHTML += `<div>${exam}</div><hr />`;
        });
        html = html.replace(
          '{{consultationExams}}',
          examsHTML.slice(0, examsHTML.length - 6),
        );
      } else {
        html = html.replace('{{consultationExams}}', 'No indicó');
      }

      const quote: IQuote[] = JSON.parse(consultation.quote);
      if (quote.length > 0) {
        let quoteHTML = `
      <table>
        <tr>
          <th style="padding-top: 0px">Servicio</th>
          <th style="padding-top: 0px">Costo</th>
        </tr>
        {{quoteList}}
      </table>
      `;
        let quoteList = '';
        quote.forEach((quote) => {
          quoteList += `
        <tr>
          <td>${quote.service}</td>
          <td>${quote.cost}</td>
        </tr>
        `;
        });
        quoteHTML = quoteHTML.replace('{{quoteList}}', quoteList);
        html = html.replace('{{consultationQuote}}', quoteHTML);
      } else {
        html = html.replace('{{consultationQuote}}', 'No indicó');
      }
    }

    html = html.replace('{{consultationId}}', consultation.id);

    const options: htmlPDF.CreateOptions = {
      format: 'Letter',
      type: 'pdf',
      border: {
        top: '0mm',
        right: '7mm',
        bottom: '7mm',
        left: '7mm',
      },
      paginationOffset: 1, // Override the initial pagination number
      header: {
        height: '7mm',
        contents:
          '<div style="text-align: right; vertical-align: top;"><small>tuhospitalvirtual.com &nbsp; doctorapp.io</small></div>',
      },
      footer: {
        height: '7mm',
        contents: {
          // first: 'Cover page',
          // 2: 'Second page', // Any page number is working. 1-based index
          default: `<div style="display: inline-block; width: 73mm;"><span style="color: #444;">{{page}}</span>/<span>{{pages}}</span></div> 
                    <div style="display: inline-block; width: 73mm; text-align: right;">${consultation.id}</div>`, // fallback value
          // last: 'Last Page',
        },
      },
    };

    htmlPDF
      .create(html, options)
      .toFile(
        `./public/consultations/reports/mr-${consultation.id}.pdf`,
        (error, response) => {
          if (error) return console.log(error);

          this.logger.log(
            `Generate report | filename=${response.filename}`,
            `${FilesService.name} | ${this.buildReportByConsultationId.name} | END`,
          );

          this.notifyService.notifyConsultationAtendded({
            id: consultation.id,
            date: moment(consultation.date)
              .utc(false)
              .format('D [de] MMMM [del] YYYY'),
            patient: {
              firstName: consultation.patient.firstName,
              lastName: consultation.patient.lastName,
            },
            doctor: {
              firstName: consultation.doctor.firstName,
              lastName: consultation.doctor.lastName,
              gender: consultation.doctor.gender,
            },
          });

          if (res) {
            // hay un endpoint que le envia res (@Res)
            // pero tambien puede ejecutarse sin ese en point y no enviarle res (@Res)
            res.json({ filename: response.filename });
          }
        },
      );

    // para generarlo directamente en el end point
    // htmlPDF.create(html, options).toStream((err, stream) => {
    //   if (err) return res.end(err.stack);
    //   this.logger.log(
    //     `PDF created`,
    //     `${FilesService.name} | ${this.uploadFilesToDirectory.name} | END`,
    //   );
    //   res.setHeader('Content-type', 'application/pdf');
    //   stream.pipe(res);
    // });
  }
}
