import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { ReportingService } from './reporting.service';

@Public()
@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('health')
  health() {
    return this.reportingService.health();
  }
}
