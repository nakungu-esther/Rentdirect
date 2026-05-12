import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { MessagingService } from './messaging.service';

@Public()
@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('health')
  health() {
    return this.messagingService.health();
  }
}
