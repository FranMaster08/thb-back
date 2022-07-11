import { Module } from '@nestjs/common';
import { NotifyController } from './controllers/notify.controller';
import { NotifyService } from './services/notify.service';

@Module({
  controllers: [NotifyController],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
