import { Controller, Post } from '@nestjs/common';
import { NotifyService } from '../services/notify.service';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post('consultation-created')
  async notifyConsultationAtendded() {
    this.notifyService.notifyTest();
  }
}
