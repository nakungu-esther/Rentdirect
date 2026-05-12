import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  health() {
    return { module: 'settings', status: 'ok' };
  }
}
