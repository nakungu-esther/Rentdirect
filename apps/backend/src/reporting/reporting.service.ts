import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportingService {
  health() {
    return { module: 'reporting', status: 'ok' };
  }
}
