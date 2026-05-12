import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { GovernmentIntegrationsService } from './government-integrations.service';

@Public()
@Controller('government-integrations')
export class GovernmentIntegrationsController {
  constructor(private readonly service: GovernmentIntegrationsService) {}

  @Get('health')
  health() {
    return this.service.health();
  }
}
