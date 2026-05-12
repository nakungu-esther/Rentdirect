import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { AnalyticsService } from './analytics.service';

@Public()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('health')
  health() {
    return this.analyticsService.health();
  }
}
