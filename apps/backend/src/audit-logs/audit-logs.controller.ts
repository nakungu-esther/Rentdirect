import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { AuditLogsService } from './audit-logs.service';

@Public()
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get('health')
  health() {
    return this.auditLogsService.health();
  }
}
