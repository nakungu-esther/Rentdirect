import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogsService {
  health() {
    return { module: 'audit-logs', status: 'ok' };
  }
}
