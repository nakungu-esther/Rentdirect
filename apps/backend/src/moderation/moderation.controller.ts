import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { ModerationService } from './moderation.service';

@Public()
@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('health')
  health() {
    return this.moderationService.health();
  }
}
