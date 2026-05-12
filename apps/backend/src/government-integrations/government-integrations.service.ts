import { Injectable } from '@nestjs/common';

@Injectable()
export class GovernmentIntegrationsService {
  health() {
    return { module: 'government-integrations', status: 'ok' };
  }
}
