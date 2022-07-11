import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  // StreamableFile,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';
import * as path from 'path';
import { CreateFilesDto } from '../dto/CreateFilesDto';
import { FileContext } from '../enum/files.enum';
import { FilesService } from '../services/files.service';

@Controller('files')
// @UseGuards(AuthGuard('jwt'))
export class FilesController {
  logger = new Logger();

  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async uploadFilesToDirectory(@Body() files: CreateFilesDto) {
    return await this.filesService.uploadFilesToDirectory(files);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('consultations/:id')
  async getAttachedFilesByConsultationId(@Param('id') id: string) {
    return await this.filesService.getAttachedFilesByContextId(
      id,
      FileContext.CONSULTATION,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('medical-history/:id')
  async getAttachedFilesByMedicalHistoryId(@Param('id') id: string) {
    return await this.filesService.getAttachedFilesByContextId(
      id,
      FileContext.MEDICAL_HISTORY,
    );
  }

  @Get(':fileName')
  getFile(@Res() res, @Param('fileName') fileName: string) {
    const path_ = path.join(
      __dirname,
      `../../../public/consultations/attachments/${fileName}`,
    );

    if (!fs.existsSync(path_)) {
      throw new NotFoundException('File not found');
    }

    res.sendFile(path_);
  }

  @Get('medical-history-file/:fileName')
  getFileMedicalHistory(@Res() res, @Param('fileName') fileName: string) {
    const path_ = path.join(
      __dirname,
      `../../../public/medicalHistories/attachments/${fileName}`,
    );

    if (!fs.existsSync(path_)) {
      throw new NotFoundException('File not found');
    }

    res.sendFile(path_);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('consultations/:id/report')
  async getReportByConsultationId(
    @Param('id') consultationId: string,
    @Res() res: any,
  ) {
    return await this.filesService.buildReportByConsultationId(
      consultationId,
      res,
    );
  }
}

// convertir en imagen
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAA..
